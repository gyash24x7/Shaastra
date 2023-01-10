import { ApolloGateway, ServiceEndpointDefinition } from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import {
	ApolloServerPluginLandingPageDisabled,
	ApolloServerPluginUsageReportingDisabled
} from "@apollo/server/plugin/disabled";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import type { GraphQLSchema } from "graphql";
import type { Server } from "http";
import type { ServiceContext } from "../context";
import { logger } from "../logger";
import { CookiePlugin } from "./cookie.plugin";
import { LandingPagePlugin } from "./landing.page.plugin";
import { ServiceDataSource } from "./service.datasource";

export type GraphQLServerOptions = {
	gateway?: boolean;
	httpServer: Server;
	schema?: GraphQLSchema;
}

export class GraphQLServer {
	private readonly apolloServicePlugins = [
		ApolloServerPluginDrainHttpServer( { httpServer: this.options.httpServer } ),
		ApolloServerPluginLandingPageDisabled(),
		ApolloServerPluginUsageReportingDisabled()
	];
	private readonly apolloGatewayPlugins = [
		ApolloServerPluginDrainHttpServer( { httpServer: this.options.httpServer } ),
		LandingPagePlugin(),
		CookiePlugin()
	];

	constructor( private readonly options: GraphQLServerOptions ) {}

	private _apolloServer: ApolloServer<ServiceContext>;

	get apolloServer() {
		return this._apolloServer;
	}

	async start() {
		const plugins = !!this.options.gateway ? this.apolloGatewayPlugins : this.apolloServicePlugins;

		if ( !!this.options.gateway ) {
			const buildService = ( { url }: ServiceEndpointDefinition ) => new ServiceDataSource( { url } );
			const gateway = new ApolloGateway( { buildService, logger, serviceHealthCheck: true } );
			this._apolloServer = new ApolloServer( { gateway, logger, plugins } );
		} else {
			this._apolloServer = new ApolloServer( { schema: this.options.schema!, plugins, logger } );
		}

		await this._apolloServer.start();
	}
}