import type { ServiceEndpointDefinition } from "@apollo/gateway";
import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import {
	ApolloServerPluginLandingPageDisabled,
	ApolloServerPluginUsageReportingDisabled
} from "@apollo/server/plugin/disabled";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { BeforeApplicationShutdown, Injectable } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { LoggerFactory } from "../logger/index.js";
import type { ServiceContext } from "../utils/index.js";
import { LandingPagePlugin } from "./landing.page.plugin.js";
import { SchemaBuilderService } from "./schema.builder.service.js";
import { ServiceDataSource } from "./service.datasource.js";

@Injectable()
export class GraphQLServer implements BeforeApplicationShutdown {
	private readonly logger = LoggerFactory.getLogger( GraphQLServer );
	private apolloServer: ApolloServer<ServiceContext>;

	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly schemaBuilder: SchemaBuilderService
	) {}

	async start( isGateway: boolean = false ) {
		this.logger.debug( "Starting GraphQL Server..." );
		const plugins = this.getPlugins( isGateway );

		if ( isGateway ) {
			const buildService = ( { url }: ServiceEndpointDefinition ) => new ServiceDataSource( { url } );
			const gateway = new ApolloGateway( { buildService, logger: this.logger } );
			this.apolloServer = new ApolloServer<ServiceContext>( { gateway, plugins, logger: this.logger } );
		} else {
			const schema = await this.schemaBuilder.buildSchema();
			this.apolloServer = new ApolloServer<ServiceContext>( { schema, plugins, logger: this.logger } );
		}

		await this.apolloServer.start();
		this.logger.debug( "GraphQL Server Started!" );
	}

	async beforeApplicationShutdown( _signal?: string ) {
		await this.apolloServer.stop();
	}

	middleware() {
		return expressMiddleware( this.apolloServer, {
			context: async ( { req, res } ) => {
				const authInfo = res.locals[ "authInfo" ];
				this.logger.info( "Building Context!" );
				this.logger.info( "Cookies: %o", req.cookies );
				return { req, res, authInfo };
			}
		} );
	}

	private getPlugins( isGateway: boolean = false ) {
		const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer();
		return isGateway ? [
			ApolloServerPluginDrainHttpServer( { httpServer } ),
			LandingPagePlugin()
		] : [
			ApolloServerPluginDrainHttpServer( { httpServer } ),
			ApolloServerPluginLandingPageDisabled(),
			ApolloServerPluginUsageReportingDisabled()
		];
	}
}