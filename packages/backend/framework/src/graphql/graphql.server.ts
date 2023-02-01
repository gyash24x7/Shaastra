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
import { LoggerFactory } from "../logger/index.js";
import type { ServiceContext, ContextFn } from "../utils/index.js";
import { SchemaBuilderService } from "./schema.builder.service.js";
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
		private readonly schemaBuilder: SchemaBuilderService
	) {}

	async start( isGateway: boolean = false ) {
		this.logger.debug( "Starting GraphQL Server..." );
		const plugins = this.getPlugins( isGateway );

		const apolloServerConfig = isGateway
			? { gateway: new ApolloGateway( { buildService, logger: this.logger } ) }
			: { schema: await this.schemaBuilder.buildSchema() };

		this.apolloServer = new ApolloServer<ServiceContext>( { ...apolloServerConfig, plugins, logger: this.logger } );

		await this.apolloServer.start();
		this.logger.debug( "GraphQL Server Started!" );
	}

	middleware() {
		return expressMiddleware( this.apolloServer, { context: createContext } );
	}

	getPlugins( isGateway: boolean = false ) {
		const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer();
		const plugins = [
			ApolloServerPluginDrainHttpServer( { httpServer } ),
			ApolloServerPluginLandingPageDisabled()
		];

		if ( !isGateway ) {
			plugins.push( ApolloServerPluginUsageReportingDisabled() );
		}

		return plugins;
	}
}