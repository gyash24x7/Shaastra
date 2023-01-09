import { ApolloGateway, IntrospectAndCompose, ServiceEndpointDefinition } from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import {
	ApolloServerPluginLandingPageDisabled,
	ApolloServerPluginUsageReportingDisabled,
	ApolloServerPluginSchemaReportingDisabled
} from "@apollo/server/plugin/disabled";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginSchemaReporting } from "@apollo/server/plugin/schemaReporting";
import type { GraphQLSchema } from "graphql";
import type { Server } from "http";
import type { Consul } from "../consul/index.js";
import type { ServiceContext } from "../context/index.js";
import { logger } from "../logger/index.js";
import { CookiePlugin } from "./cookie.plugin.js";
import { LandingPagePlugin } from "./landing.page.plugin.js";
import { ServiceDataSource } from "./service.datasource.js";

export type GraphQLServerOptions = {
	gateway?: boolean;
	httpServer: Server;
	schema?: GraphQLSchema;
}

export class GraphQLServer {
	private readonly apolloServicePlugins = [
		ApolloServerPluginDrainHttpServer( { httpServer: this.options.httpServer } ),
		ApolloServerPluginSchemaReportingDisabled(),
		ApolloServerPluginLandingPageDisabled(),
		ApolloServerPluginUsageReportingDisabled()
	];
	private readonly apolloGatewayPlugins = [
		ApolloServerPluginDrainHttpServer( { httpServer: this.options.httpServer } ),
		ApolloServerPluginSchemaReporting(),
		LandingPagePlugin(),
		CookiePlugin()
	];

	constructor( private readonly options: GraphQLServerOptions ) {}

	private _apolloServer: ApolloServer<ServiceContext>;

	get apolloServer() {
		return this._apolloServer;
	}

	async start( consul: Consul ) {
		const plugins = !!this.options.gateway ? this.apolloGatewayPlugins : this.apolloServicePlugins;

		if ( !!this.options.gateway ) {
			const services = await consul.getRegisteredServices();

			const supergraphSdl = new IntrospectAndCompose( {
				subgraphs: services
					.filter( service => service.ID !== "gateway" )
					.map( service => (
						{ name: service.ID, url: `${ service.Meta[ "url" ] }/api/graphql` }
					) )
			} );

			const buildService = ( { url }: ServiceEndpointDefinition ) => new ServiceDataSource( { url } );

			const gateway = new ApolloGateway( { supergraphSdl, buildService, logger, serviceHealthCheck: true } );

			this._apolloServer = new ApolloServer( { gateway, logger, plugins } );
		} else {
			this._apolloServer = new ApolloServer( { schema: this.options.schema!, plugins, logger } );
		}

		await this._apolloServer.start();
	}
}