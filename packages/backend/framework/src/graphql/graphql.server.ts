import type { ServiceEndpointDefinition } from "@apollo/gateway";
import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import {
	ApolloServerPluginLandingPageDisabled,
	ApolloServerPluginUsageReportingDisabled
} from "@apollo/server/plugin/disabled";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Injectable } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { type AppConfig, Config } from "../config/index.js";
import { LoggerFactory } from "../logger/index.js";
import type { ContextFn, ServiceContext } from "./graphql.types.js";
import { SchemaBuilderService } from "./schema.builder.service.js";
import { SchemaPublishService } from "./schema.publish.service.js";
import { ServiceDataSource } from "./service.datasource.js";

export const buildService = ( { url }: ServiceEndpointDefinition ) => new ServiceDataSource( { url } );
export const createContext: ContextFn<ServiceContext> = async ( { req, res } ) => {
	const authInfo = res.locals[ "authInfo" ];
	return { req, res, authInfo };
};

@Injectable()
export class GraphQLServer {
	private readonly logger = LoggerFactory.getLogger( GraphQLServer );
	private apolloServer: ApolloServer<ServiceContext>;

	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly schemaBuilder: SchemaBuilderService,
		private readonly schemaPublisher: SchemaPublishService,
		@Config() private readonly config: AppConfig
	) {}

	async start() {
		this.logger.debug( "Starting GraphQL Server..." );
		const plugins = this.getPlugins();

		const apolloServerConfig = this.config.appInfo.isGateway
			? { gateway: new ApolloGateway( { buildService, logger: this.logger } ) }
			: { schema: await this.schemaBuilder.buildSchema() };

		if ( !this.config.appInfo.isGateway ) {
			this.schemaPublisher.publishSchema();
		}

		this.apolloServer = new ApolloServer<ServiceContext>( { ...apolloServerConfig, plugins, logger: this.logger } );

		await this.apolloServer.start();
		this.logger.debug( "GraphQL Server Started!" );
	}

	middleware() {
		return expressMiddleware( this.apolloServer, { context: createContext } );
	}

	getPlugins() {
		const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer();
		const plugins = [
			ApolloServerPluginDrainHttpServer( { httpServer } ),
			ApolloServerPluginLandingPageDisabled()
		];

		if ( !this.config.appInfo.isGateway ) {
			plugins.push( ApolloServerPluginUsageReportingDisabled() );
		}

		return plugins;
	}
}