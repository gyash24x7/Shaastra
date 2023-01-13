import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { capitalCase, constantCase } from "change-case";
import cookieParser from "cookie-parser";
import type { Express, Request, Response } from "express";
import express, { NextFunction } from "express";
import http from "http";
import process from "node:process";
import { deserializeUser, JwtUtils } from "../../auth/index.js";
import type { ServiceContext } from "../../context/index.js";
import { EventBus } from "../../events/index.js";
import { GraphQLServer } from "../../graphql/index.js";
import { HealthChecker } from "../../health/index.js";
import { expressLoggingMiddleware, createLogger } from "../../logger/index.js";
import type { BasePrisma } from "../../prisma/index.js";
import type { RestApi } from "../../rest/index.js";
import type { AppInfo, IApplication, IApplicationOptions } from "../index.js";

export type ExpressMiddleware = ( req: Request, res: Response, next: NextFunction ) => unknown | Promise<unknown>

export type ExpressErrorHandler = (
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) => unknown | Promise<unknown>

export class ExpressApplication<P extends BasePrisma> implements IApplication<P, Express> {
	readonly _app: Express;
	readonly logger = createLogger();
	readonly graphQLServer: GraphQLServer<P>;
	readonly appInfo: AppInfo;
	readonly restApis: RestApi<P>[] = [];
	readonly httpServer: http.Server;
	readonly eventBus: EventBus<P>;
	readonly middlewares: ExpressMiddleware[];
	readonly errorHandlers: ExpressErrorHandler[];
	readonly jwtUtils: JwtUtils;
	readonly healthCheck: HealthChecker;
	readonly prisma: P;

	private readonly isGateway: boolean = false;
	private readonly resolvers: any;

	constructor( options: IApplicationOptions<P> ) {
		const { name, restApis = [], isGateway, resolvers, events, prisma } = options;

		this.isGateway = !!isGateway;
		this.prisma = prisma;
		this.resolvers = resolvers;

		this.prisma.$use( async ( params, next ) => {
			const before = Date.now();
			const result = await next( params );
			const after = Date.now();
			this.logger.debug( `Query ${ params.model }.${ params.action } took ${ after - before }ms` );
			return result;
		} );

		this.appInfo = this.generateAppInfo( name );
		this.restApis.push( ...restApis );
		this.middlewares = options.middlewares || [];
		this.errorHandlers = options.errorHandlers || [];
		this.jwtUtils = new JwtUtils( {
			audience: process.env[ "AUTH_AUDIENCE" ]!,
			domain: process.env[ "AUTH_DOMAIN" ]!
		}, this.logger );

		this._app = express();
		this.httpServer = http.createServer( this._app );

		this.graphQLServer = new GraphQLServer();
		this.eventBus = new EventBus( events || {}, this.logger );
		this.healthCheck = new HealthChecker( this.httpServer, this.logger );
	}

	generateAppInfo( id: string ): AppInfo {
		const port = parseInt( process.env[ `${ constantCase( id ) }_PORT` ] || "8000" );
		const name = `Shaastra ${ capitalCase( id ) }`;
		const pkg = `@shaastra/${ id }`;
		const address = "localhost";
		const url = `http://localhost:${ port }`;
		return { id, name, pkg, port, address, url };
	}

	applyMiddlewares() {
		this._app.use( bodyParser.json() );
		this._app.use( cookieParser() );
		this._app.use( expressLoggingMiddleware( this.logger ) );
		this._app.use( deserializeUser( this.jwtUtils ) );

		this.middlewares.forEach( middleware => {
			this._app.use( middleware );
		} );

		this._app.use( "/api/graphql", this.graphQLServer.middleware( this.createContext ) );
	}

	applyErrorHandlers() {
		this.errorHandlers.forEach( errorHandler => {
			this._app.use( errorHandler );
		} );
	}

	registerRestApis() {
		const handler = ( api: RestApi<P> ) => async ( req: Request, res: Response ) => {
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
		await this.graphQLServer.start( this.isGateway, this.resolvers, this.httpServer, this.logger );

		this.applyMiddlewares();
		this.registerRestApis();
		this.applyErrorHandlers();

		await new Promise<void>( ( resolve ) => this.httpServer.listen( { port: this.appInfo.port }, resolve ) );
		this.logger.info( `🚀 ${ this.appInfo.name } ready at ${ this.appInfo.url }/api/graphql` );
	}

	async createContext( { req, res }: ExpressContextFunctionArgument ): Promise<ServiceContext<P>> {
		const authInfo = res.locals[ "authInfo" ];
		return {
			eventBus: this.eventBus,
			jwtUtils: this.jwtUtils,
			logger: this.logger,
			req,
			res,
			authInfo,
			prisma: this.prisma
		};
	};
}