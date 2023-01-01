import type {
	AppInfo,
	ExpressErrorHandler,
	ExpressMiddleware,
	IApplication,
	IApplicationOptions
} from "../../index.js";
import { defaultOptions, GraphQLServer } from "../../index.js";
import type { Express, Request, Response } from "express";
import express from "express";
import { Consul } from "../../consul/index.js";
import http from "http";
import { CommandBus, EventBus, QueryBus } from "../../cqrs/index.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import type { ServiceContextFn } from "../../context/index.js";
import { capitalCase, constantCase } from "change-case";
import { HealthChecker, healthCheckRestApi, healthRestApi } from "../../health/index.js";
import type { RestApi } from "../../rest/index.js";
import process from "node:process";
import { expressLoggingMiddleware, logger } from "../../logger/index.js";

export class ExpressApplication implements IApplication<Express> {
	readonly _app: Express;
	readonly graphQLServer: GraphQLServer;
	readonly appInfo: AppInfo;
	readonly consul: Consul;
	readonly restApis: RestApi[] = [ healthRestApi, healthCheckRestApi ];
	readonly httpServer: http.Server;
	readonly healthChecker: HealthChecker;
	readonly commandBus: CommandBus;
	readonly queryBus: QueryBus;
	readonly eventBus: EventBus;
	readonly middlewares: ExpressMiddleware[];
	readonly errorHandlers: ExpressErrorHandler[];

	constructor( options: IApplicationOptions = defaultOptions ) {
		const { name, restApis = [], graphql: { resolvers, gateway }, cqrs } = options;

		this.appInfo = this.generateAppInfo( name );
		this.restApis.push( ...restApis );
		this.healthChecker = new HealthChecker();
		this.middlewares = options.middlewares || [];
		this.errorHandlers = options.errorHandlers || [];

		this._app = express();
		this.httpServer = http.createServer( this._app );

		this.consul = new Consul();
		this.graphQLServer = new GraphQLServer( { httpServer: this.httpServer, gateway, resolvers } );

		this.commandBus = new CommandBus( cqrs?.commands || {} );
		this.queryBus = new QueryBus( cqrs?.queries || {} );
		this.eventBus = new EventBus( cqrs?.events || {} );
	}

	generateAppInfo( id: string ): AppInfo {
		const port = parseInt( process.env[ `${ constantCase( id ) }_PORT` ] || "8000" );
		const name = `Shaastra ${ capitalCase( id ) }`;
		const pkg = `@shaastra/${ id }`;
		const address = "localhost";
		const url = `http://localhost:${ port }`;
		return { id, name, pkg, port, address, url };
	}

	async applyMiddlewares() {
		this._app.use( bodyParser.json() );
		this._app.use( cookieParser() );
		this._app.use( expressLoggingMiddleware );

		this.middlewares.forEach( middleware => {
			this._app.use( middleware );
		} );

		await this.graphQLServer.applyMiddleware( this._app, this.createContext );

		this.errorHandlers.forEach( errorHandler => {
			this._app.use( errorHandler );
		} );
	}

	registerRestApis() {
		const handler = ( api: RestApi ) => async ( req: Request, res: Response ) => {
			const context = await this.createContext( { req, res } );
			api.handler( context );
		};

		this.restApis.forEach( api => {
			switch ( api.method ) {
				case "GET":
					this._app.get( api.path, handler( api ) );
					break;
				case "POST":
					this._app.post( api.path, handler( api ) );
					break;
				case "PUT":
					this._app.put( api.path, handler( api ) );
					break;
				case "DELETE":
					this._app.delete( api.path, handler( api ) );
					break;
				case "ALL":
					this._app.all( api.path, handler( api ) );
					break;
			}
		} );
	}

	async start(): Promise<void> {
		await this.applyMiddlewares();
		this.registerRestApis();

		await new Promise<void>( ( resolve ) => this.httpServer.listen( { port: this.appInfo.port }, resolve ) );
		logger.info( `🚀 ${ this.appInfo.name } ready at ${ this.appInfo.url }/api/graphql` );

		await this.consul.registerService( this.appInfo );
	}

	createContext: ServiceContextFn = async ( { req, res } ) => {
		const { consul, commandBus, queryBus, eventBus, appInfo, healthChecker } = this;
		const idCookie = req.cookies[ "identity" ];
		return { req, res, consul, commandBus, queryBus, eventBus, appInfo, healthChecker, idCookie };
	};

}