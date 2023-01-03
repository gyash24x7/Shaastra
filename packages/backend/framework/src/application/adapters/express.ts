import type {
	AppInfo,
	ExpressContext,
	ExpressErrorHandler,
	ExpressMiddleware,
	IApplication,
	IApplicationOptions,
	ServiceContext
} from "../../index.js";
import { EventBus, GraphQLServer } from "../../index.js";
import type { Express, Request, Response } from "express";
import express from "express";
import { Consul } from "../../consul/index.js";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { capitalCase, constantCase } from "change-case";
import type { RestApi } from "../../rest/index.js";
import process from "node:process";
import { pinoHttp } from "pino-http";
import { expressMiddleware } from "@apollo/server/express4";
import { logger as frameworkLogger } from "../../logger/index.js";

export class ExpressApplication implements IApplication<Express> {
	readonly _app: Express;
	readonly logger = frameworkLogger;
	readonly graphQLServer: GraphQLServer;
	readonly appInfo: AppInfo;
	readonly consul: Consul;
	readonly restApis: RestApi[] = [];
	readonly httpServer: http.Server;
	readonly eventBus: EventBus;
	readonly middlewares: ExpressMiddleware[];
	readonly errorHandlers: ExpressErrorHandler[];

	constructor( options: IApplicationOptions ) {
		const { name, restApis = [], graphql: { schema, gateway }, events } = options;

		this.appInfo = this.generateAppInfo( name );
		this.restApis.push( ...restApis );
		this.middlewares = options.middlewares || [];
		this.errorHandlers = options.errorHandlers || [];

		this._app = express();
		this.httpServer = http.createServer( this._app );

		this.consul = new Consul();
		this.graphQLServer = new GraphQLServer( { httpServer: this.httpServer, gateway, schema } );
		this.eventBus = new EventBus( events || {} );
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
		this._app.use( pinoHttp( { logger: this.logger, autoLogging: false } ) );

		this.middlewares.forEach( middleware => {
			this._app.use( middleware );
		} );

		this._app.use(
			"/api/graphql",
			expressMiddleware( this.graphQLServer.apolloServer, { context: this.createContext } )
		);

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
		await this.graphQLServer.start( this.consul );

		await this.applyMiddlewares();
		this.registerRestApis();

		await new Promise<void>( ( resolve ) => this.httpServer.listen( { port: this.appInfo.port }, resolve ) );
		this.logger.info( `🚀 ${ this.appInfo.name } ready at ${ this.appInfo.url }/api/graphql` );

		await this.consul.registerService( this.appInfo );
	}

	async createContext( { req, res }: ExpressContext ): Promise<ServiceContext> {
		const idCookie = req.cookies[ "identity" ];
		return { req, res, idCookie };
	};
}