import type { IApplication, IApplicationOptions } from "../../index.js";
import { defaultApplicationOptions } from "../../index.js";
import type { Express, Request, Response } from "express";
import express from "express";
import type { AppInfo } from "../../config/index.js";
import { ApolloServer } from "@apollo/server";
import { Consul } from "../../consul/index.js";
import http from "http";
import { CommandBus, EventBus, QueryBus } from "../../cqrs/index.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import type { ServiceContext, ServiceContextFn } from "../../context/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import { capitalCase, constantCase } from "change-case";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { join } from "node:path";
import { HealthChecker, healthCheckRestApi, healthRestApi } from "../../health/index.js";
import type { RestApi } from "../../rest/index.js";
import { gql } from "graphql-tag";
import process from "node:process";
import { readFileSync } from "node:fs";
import { expressLoggingMiddleware, logger } from "../../logger/index.js";

export class ExpressApplication implements IApplication<Express> {
	readonly _app: Express;
	readonly apolloServer: ApolloServer<ServiceContext>;
	readonly appInfo: AppInfo;
	readonly consul: Consul;
	readonly restApis: RestApi<ServiceContext>[] = [ healthRestApi, healthCheckRestApi ];
	readonly httpServer: http.Server;
	readonly healthChecker: HealthChecker<ServiceContext>;
	readonly commandBus: CommandBus;
	readonly queryBus: QueryBus;
	readonly eventBus: EventBus;

	constructor( options: IApplicationOptions = defaultApplicationOptions ) {
		const { name, restApis = [], graphql: { resolvers }, cqrs: { commands, queries, events } } = options;

		this.appInfo = this.generateAppInfo( name );
		this.restApis.push( ...restApis );
		this.healthChecker = new HealthChecker<ServiceContext>();

		this._app = express();
		this.httpServer = http.createServer( this._app );

		this.consul = new Consul(
			{ host: process.env[ "CONSUL_HOST" ] || "localhost", port: process.env[ "CONSUL_PORT" ] || "8500" }
		);

		const typeDefsString = readFileSync( join( process.cwd(), "src/graphql/schema.graphql" ), "utf-8" );
		const typeDefs = gql( typeDefsString );

		let schema = buildSubgraphSchema( { typeDefs, resolvers } as any );

		// if ( !!shield ) {
		// 	schema = applyMiddleware( schema, shield );
		// }

		this.apolloServer = new ApolloServer<ServiceContext>( {
			schema,
			plugins: [
				ApolloServerPluginDrainHttpServer( { httpServer: this.httpServer } ),
				ApolloServerPluginLandingPageDisabled()
			]
		} );

		this.commandBus = new CommandBus( commands );
		this.queryBus = new QueryBus( queries );
		this.eventBus = new EventBus( events );
	}

	applyMiddlewares() {
		this._app.use( bodyParser.json() );
		this._app.use( cookieParser() );
		this._app.use( expressLoggingMiddleware );
	}

	registerRestApis() {
		const handler = ( api: RestApi<ServiceContext> ) => async ( req: Request, res: Response ) => {
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
		this.applyMiddlewares();
		this.registerRestApis();

		await this.apolloServer.start();

		this._app.use( "/api/graphql", expressMiddleware( this.apolloServer, { context: this.createContext } ) );

		await new Promise<void>( ( resolve ) => this.httpServer.listen( { port: this.appInfo.port }, resolve ) );
		logger.info( `🚀 ${ this.appInfo.name } ready at ${ this.appInfo.url }/api/graphql` );

		await this.consul.registerService( this.appInfo );
	}

	createContext: ServiceContextFn = async ( { req, res } ) => {
		const { consul, commandBus, queryBus, eventBus, appInfo, healthChecker } = this;
		return { req, res, logger, consul, commandBus, queryBus, eventBus, appInfo, healthChecker };
	};

	private generateAppInfo( id: string ): AppInfo {
		const port = parseInt( process.env[ `${ constantCase( id ) }_PORT` ] || "8000" );
		const name = `Shaastra ${ capitalCase( id ) }`;
		const pkg = `@shaastra/${ id }`;
		const address = "localhost";
		const url = `http://localhost:${ port }`;
		return { id, name, pkg, port, address, url };
	}

}