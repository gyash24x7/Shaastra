import type { Server } from "http";
import type { GraphQLSchema } from "graphql/index.js";
import { ApolloServer } from "@apollo/server";
import type { ServiceContext } from "../context/index.js";
import type { Consul } from "../consul/index.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
	ApolloServerPluginLandingPageDisabled,
	ApolloServerPluginUsageReportingDisabled
} from "@apollo/server/plugin/disabled";
import { CookiePlugin } from "./cookie.plugin.js";
import { ApolloGateway, IntrospectAndCompose, ServiceEndpointDefinition } from "@apollo/gateway";
import { ServiceDataSource } from "./service.datasource.js";
import { logger } from "../logger/index.js";
import { LandingPagePlugin } from "./landing.page.plugin.js";

export type GraphQLServerOptions = {
	gateway?: boolean;
	httpServer: Server;
	schema?: GraphQLSchema;
}

export class GraphQLServer {
	constructor( private readonly options: GraphQLServerOptions ) {}

	private _apolloServer: ApolloServer<ServiceContext>;

	get apolloServer() {
		return this._apolloServer;
	}

	async start( consul: Consul ) {
		const plugins = [
			ApolloServerPluginDrainHttpServer( { httpServer: this.options.httpServer } ),
			!!this.options.gateway ? LandingPagePlugin() : ApolloServerPluginLandingPageDisabled(),
			!!this.options.gateway ? CookiePlugin() : ApolloServerPluginUsageReportingDisabled()
		];

		if ( !!this.options.gateway ) {
			const services = await consul.getRegisteredServices();

			const supergraphSdl = new IntrospectAndCompose( {
				subgraphs: services
					.filter( service => service.ID !== "gateway" )
					.map( service => ( { name: service.ID, url: `${ service.Meta[ "url" ] }/api/graphql` } ) )
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