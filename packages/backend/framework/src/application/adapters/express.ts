import type {
	IBaseApplication,
	IBaseApplicationOptions,
	IGatewayApplication,
	IGatewayApplicationOptions,
	IServiceApplication,
	IServiceApplicationOptions
} from "../../index.js";
import type { Express } from "express";
import type { AppInfo } from "../../config/index.js";
import { ApolloServer } from "@apollo/server";
import type { Signale } from "signale";
import type { Consul } from "../../consul/index.js";
import type * as http from "http";
import { CommandBus, EventBus, QueryBus } from "../../cqrs/index.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import type {
	ContextFn,
	GatewayContext,
	GatewayContextFn,
	ServiceBaseContext,
	ServiceContext,
	ServiceContextFn
} from "../../context/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import { capitalCase, constantCase } from "change-case";
import { ApolloGateway, ServiceEndpointDefinition } from "@apollo/gateway";
import { CookiePlugin, ServiceDataSource } from "../../graphql/index.js";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { join } from "node:path";
import { HealthChecker, healthCheckRestApi, healthRestApi } from "../../health/index.js";
import type { RestApi } from "../../rest/index.js";

export abstract class ExpressBaseApplication<Ctx extends ServiceBaseContext> implements IBaseApplication<Ctx, Express> {
	readonly _app: Express;
	apolloServer: ApolloServer<Ctx>;
	readonly appInfo: AppInfo;
	readonly consul: Consul;
	readonly restApis: RestApi<Ctx>[] = [ healthRestApi, healthCheckRestApi ];
	readonly httpServer: http.Server;
	readonly logger: Signale;
	readonly healthChecker: HealthChecker<Ctx>;
	abstract createContext: ContextFn<Ctx>;

	protected constructor( options: IBaseApplicationOptions<Ctx> ) {
		const { name, restApis } = options;

		this.appInfo = this.generateAppInfo( name );
		this.restApis.push( ...restApis );
		this.healthChecker = new HealthChecker<Ctx>();
	}

	applyMiddlewares() {
		this._app.use( bodyParser.json() );
		this._app.use( cookieParser() );
	}

	registerRestApis() {
		const methodFnMap = {
			GET: this._app.get,
			POST: this._app.post,
			PUT: this._app.put,
			DELETE: this._app.delete,
			ALL: this._app.all
		};

		this.restApis.forEach( controller => {
			let method = methodFnMap[ controller.method ];
			method( controller.path, async ( req, res ) => {
				const context = await this.createContext( { req, res } );
				controller.handler( context );
			} );
		} );
	}

	async start(): Promise<void> {
		this.applyMiddlewares();
		this.registerRestApis();

		await this.apolloServer.start();

		this._app.use( "/api/graphql", expressMiddleware( this.apolloServer, { context: this.createContext } ) );

		await new Promise<void>( ( resolve ) => this.httpServer.listen( { port: this.appInfo.port }, resolve ) );
		this.logger.scope( "Global" ).success( `🚀 ${ this.appInfo.name } ready at ${ this.appInfo.url }/api/graphql` );

		await this.consul.registerService( this.appInfo );
	}

	private generateAppInfo( id: string ): AppInfo {
		const port = parseInt( process.env[ `${ constantCase( id ) }_PORT` ] || "8000" );
		const name = `Shaastra ${ capitalCase( id ) }`;
		const pkg = `@shaastra/${ id }`;
		const address = "localhost";
		const url = `http://localhost:${ port }`;
		return { id, name, pkg, port, address, url };
	}

}

export class ExpressGatewayApplication extends ExpressBaseApplication<GatewayContext> implements IGatewayApplication<Express> {
	constructor( options: IGatewayApplicationOptions ) {
		super( options );

		this.apolloServer = new ApolloServer<GatewayContext>( {
			gateway: new ApolloGateway( {
				supergraphSdl: options.graphql.supergraphSdl,
				buildService: ( { url }: ServiceEndpointDefinition ) => new ServiceDataSource( { url } )
			} ),
			plugins: [
				ApolloServerPluginDrainHttpServer( { httpServer: this.httpServer } ),
				ApolloServerPluginLandingPageDisabled(),
				CookiePlugin()
			]
		} );

	}

	createContext: GatewayContextFn = async ( { req, res } ) => {
		const { consul, logger, appInfo, healthChecker } = this;
		return { req, res, consul, appInfo, logger, idCookie: req.cookies.identity, healthChecker };
	};

	override async start() {

		this.applyMiddlewares();
		this.registerRestApis();

		await this.apolloServer.start();

		this._app.get( "/api/graphql", ( _req, res ) => {
			res.sendFile( join( process.cwd(), "src/assets/graphiql.html" ) );
		} );

		this._app.use( "/api/graphql", expressMiddleware( this.apolloServer, { context: this.createContext } ) );

		await new Promise<void>( ( resolve ) => this.httpServer.listen( { port: this.appInfo.port }, resolve ) );
		this.logger.scope( "Global" ).success( `🚀 ${ this.appInfo.name } ready at ${ this.appInfo.url }/api/graphql` );

		await this.consul.registerService( this.appInfo );
	}
}

export class ExpressServiceApplication<P> extends ExpressBaseApplication<ServiceContext<P>> implements IServiceApplication<P, Express> {
	readonly commandBus: CommandBus<P>;
	readonly queryBus: QueryBus<P>;
	readonly eventBus: EventBus<P>;
	readonly prisma: P;

	constructor( options: IServiceApplicationOptions<P> ) {
		super( options );
		const { graphql: { typeDefs, resolvers }, cqrs: { commands, queries, events }, prisma } = options;

		let schema = buildSubgraphSchema( { typeDefs, resolvers } as any );

		// if ( !!shield ) {
		// 	schema = applyMiddleware( schema, shield );
		// }

		this.apolloServer = new ApolloServer<ServiceContext<P>>( {
			schema,
			plugins: [
				ApolloServerPluginDrainHttpServer( { httpServer: this.httpServer } ),
				ApolloServerPluginLandingPageDisabled()
			]
		} );

		this.prisma = prisma;
		this.commandBus = new CommandBus<P>( commands );
		this.queryBus = new QueryBus<P>( queries );
		this.eventBus = new EventBus<P>( events );
	}

	createContext: ServiceContextFn<P> = async ( { req, res } ) => {
		const { prisma, logger, consul, commandBus, queryBus, eventBus, appInfo, healthChecker } = this;
		return { req, res, prisma, logger, consul, commandBus, queryBus, eventBus, appInfo, healthChecker };
	};
}