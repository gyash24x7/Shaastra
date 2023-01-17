import bodyParser from "body-parser";
import { capitalCase, constantCase } from "change-case";
import type { Express, Request, Response } from "express";
import express, { NextFunction } from "express";
import http from "http";
import process from "node:process";
import { deserializeUser, JwtUtils } from "../../auth/index.js";
import type { ServiceContextFn } from "../../context/index.js";
import { EventBus } from "../../events/index.js";
import { GraphQLServer } from "../../graphql/index.js";
import { HealthChecker } from "../../health/index.js";
import { expressLoggingMiddleware, createLogger } from "../../logger/index.js";
import type { BasePrisma } from "../../prisma/index.js";
import type { RestApi } from "../../rest/index.js";
import type { AppInfo, IApplicationOptions } from "../index.js";

export type ExpressMiddlewareFn = ( req: Request, res: Response, next: NextFunction ) => unknown | Promise<unknown>

export type ExpressMiddleware = {
	path?: string;
	fn: ExpressMiddlewareFn;
}

export type ExpressErrorHandler = (
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) => unknown | Promise<unknown>

export class ExpressApplication<P extends BasePrisma> {
	// @ts-ignore
	private readonly healthCheck: HealthChecker;
	private readonly app: Express;
	private readonly logger = createLogger();
	private readonly graphQLServer: GraphQLServer<P>;
	private readonly appInfo: AppInfo;
	private readonly httpServer: http.Server;
	private readonly eventBus: EventBus<P>;
	private readonly jwtUtils: JwtUtils;
	private readonly prisma: P;

	private readonly middlewares: ExpressMiddleware[] = [];
	private readonly errorHandlers: ExpressErrorHandler[] = [];
	private readonly restApis: RestApi<P>[] = [];

	constructor( options: IApplicationOptions<P> ) {
		const { name, restApis, isGateway, resolvers, events, prisma, middlewares, errorHandlers } = options;

		this.prisma = prisma;

		this.prisma.$use( async ( params, next ) => {
			const before = Date.now();
			const result = await next( params );
			const after = Date.now();
			this.logger.debug( `Query ${ params.model }.${ params.action } took ${ after - before }ms` );
			return result;
		} );

		this.appInfo = this.generateAppInfo( name );
		this.jwtUtils = new JwtUtils( {
			audience: process.env[ "AUTH_AUDIENCE" ]!,
			domain: process.env[ "AUTH_DOMAIN" ]!
		}, this.logger );

		this.app = express();
		this.httpServer = http.createServer( this.app );

		this.graphQLServer = new GraphQLServer( !!isGateway, resolvers, this.httpServer, this.logger );
		this.eventBus = new EventBus( events || {}, this.logger );
		this.healthCheck = new HealthChecker( this.httpServer, this.logger );

		this.middlewares = middlewares || [];
		this.errorHandlers = errorHandlers || [];
		this.restApis = restApis || [];
	}

	async start(): Promise<void> {
		await this.graphQLServer.start();
		this.logger.debug( "Started GraphQL Server!" );

		this.applyMiddlewares();
		this.logger.debug( "Applied Middlewares!" );

		this.registerRestApis();
		this.logger.debug( "Registered Rest Apis!" );

		this.applyErrorHandlers();
		this.logger.debug( "Applied Error Handlers!" );

		await new Promise<void>( ( resolve ) => this.httpServer.listen( { port: this.appInfo.port }, resolve ) );
		this.logger.info( `🚀 ${ this.appInfo.name } ready at ${ this.appInfo.url }/api/graphql` );
	}

	private applyErrorHandlers() {
		this.errorHandlers.forEach( errorHandler => {
			this.app.use( errorHandler );
		} );
	}

	private registerRestApis() {
		const handler = ( api: RestApi<P> ) => async ( req: Request, res: Response ) => {
			const context = await this.createContext()( { req, res } );
			api.handler( context );
		};

		this.restApis.forEach( api => {
			switch ( api.method ) {
				case "GET":
					this.app.get( api.path, handler( api ) );
					break;
				case "POST":
					this.app.post( api.path, handler( api ) );
					break;
				case "PUT":
					this.app.put( api.path, handler( api ) );
					break;
				case "DELETE":
					this.app.delete( api.path, handler( api ) );
					break;
				case "ALL":
					this.app.all( api.path, handler( api ) );
					break;
			}
		} );
	}

	private createContext(): ServiceContextFn<P> {
		const baseCtx = {
			eventBus: this.eventBus,
			jwtUtils: this.jwtUtils,
			logger: this.logger,
			prisma: this.prisma
		};

		return async ( { req, res } ) => {
			const authInfo = res.locals[ "authInfo" ];
			return { ...baseCtx, req, res, authInfo };
		};
	};

	private generateAppInfo( id: string ): AppInfo {
		const port = parseInt( process.env[ `${ constantCase( id ) }_PORT` ] || "8000" );
		const name = `Shaastra ${ capitalCase( id ) }`;
		const pkg = `@shaastra/${ id }`;
		const address = "localhost";
		const url = `http://localhost:${ port }`;
		return { id, name, pkg, port, address, url };
	}

	private applyMiddlewares() {
		this.app.use( bodyParser.json() );
		this.app.use( expressLoggingMiddleware( this.logger ) );
		this.app.use( deserializeUser( this.jwtUtils ) );

		this.middlewares.forEach( ( { path, fn } ) => {
			if ( !!path ) {
				this.app.use( path, fn );
			} else {
				this.app.use( fn );
			}
		} );

		this.app.use( "/api/graphql", this.graphQLServer.middleware( this.createContext() ) );
	}
}