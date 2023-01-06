import type { AppInfo, ExpressContext, IApplication, IApplicationOptions, ServiceContext } from "../..";
import { deserializeUser, EventBus, GraphQLServer, JwtUtils } from "../..";
import type { Express, Request, Response } from "express";
import express, { NextFunction } from "express";
import { Consul } from "../../consul";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { capitalCase, constantCase } from "change-case";
import type { RestApi } from "../../rest";
import process from "node:process";
import { expressMiddleware } from "@apollo/server/express4";
import { expressLoggingMiddleware, logger as frameworkLogger } from "../../logger";
import { HealthChecker } from "../../health";

export type ExpressMiddleware = ( req: Request, res: Response, next: NextFunction ) => unknown | Promise<unknown>

export type ExpressErrorHandler = (
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) => unknown | Promise<unknown>

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
	readonly jwtUtils: JwtUtils;
	readonly healthCheck: HealthChecker;

	constructor( options: IApplicationOptions ) {
		const { name, restApis = [], graphql: { schema, gateway }, events } = options;

		this.appInfo = this.generateAppInfo( name );
		this.restApis.push( ...restApis );
		this.middlewares = options.middlewares || [];
		this.errorHandlers = options.errorHandlers || [];
		this.jwtUtils = new JwtUtils( {
			audience: process.env[ "AUTH_AUDIENCE" ]!,
			domain: process.env[ "AUTH_DOMAIN" ]!
		} );

		this._app = express();
		this.httpServer = http.createServer( this._app );

		this.consul = new Consul();
		this.graphQLServer = new GraphQLServer( { httpServer: this.httpServer, gateway, schema } );
		this.eventBus = new EventBus( events || {} );
		this.healthCheck = new HealthChecker( this.httpServer, this.consul, this.appInfo );
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
		this._app.use( expressLoggingMiddleware() );
		this._app.use( deserializeUser( this.jwtUtils ) );

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
		const authInfo = res.locals[ "authInfo" ];
		return { req, res, idCookie, authInfo };
	};
}