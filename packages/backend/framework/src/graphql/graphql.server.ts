import { ApolloGateway, ServiceEndpointDefinition } from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import {
	ApolloServerPluginLandingPageDisabled,
	ApolloServerPluginUsageReportingDisabled
} from "@apollo/server/plugin/disabled";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { gql } from "graphql-tag";
import { readFileSync } from "node:fs";
import type http from "node:http";
import { join } from "node:path";
import type { Logger } from "pino";
import type { ServiceContext, ServiceContextFn } from "../context/index.js";
import { LandingPagePlugin } from "./landing.page.plugin.js";
import { ServiceDataSource } from "./service.datasource.js";

export class GraphQLServer<P> {
	private apolloServer: ApolloServer<ServiceContext<P>>;

	async start( isGateway: boolean, resolvers: any, httpServer: http.Server, logger: Logger ) {
		const plugins = this.getPlugins( httpServer, isGateway );

		if ( isGateway ) {
			const buildService = ( { url }: ServiceEndpointDefinition ) => new ServiceDataSource( { url } );
			const gateway = new ApolloGateway( { buildService, logger } );
			this.apolloServer = new ApolloServer<ServiceContext<P>>( { gateway, logger, plugins } );
		} else {
			const typeDefsString = readFileSync( join( process.cwd(), "src/graphql/schema.graphql" ), "utf-8" );
			const typeDefs = gql( typeDefsString );
			const schema = buildSubgraphSchema( { typeDefs, resolvers } );
			this.apolloServer = new ApolloServer<ServiceContext<P>>( { schema, plugins, logger } );
		}

		await this.apolloServer.start();
	}

	middleware( context: ServiceContextFn<P> ) {
		return expressMiddleware( this.apolloServer, { context } );
	}

	private getPlugins( httpServer: http.Server, isGateway: boolean = false ) {
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