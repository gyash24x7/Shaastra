import type { ServiceEndpointDefinition } from "@apollo/gateway";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { ApolloServer, ApolloServerPlugin } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import type { Express } from "express";
import type { GraphQLSchema } from "graphql";
import type { Server } from "http";
import type { Signale } from "signale";
import type { GatewayContextFn, ServiceContextFn } from "./context.js";

export async function startApolloServer<P = unknown>(
	app: Express,
	httpServer: Server,
	schema: GraphQLSchema,
	logger: Signale,
	createContext: ServiceContextFn<P>
) {
	logger.pending( `Starting Apollo Server...` );
	const apolloServer = new ApolloServer( {
		schema,
		plugins: [ ApolloServerPluginDrainHttpServer( { httpServer } ) ]
	} );

	await apolloServer.start();

	app.use( "/api/graphql", expressMiddleware( apolloServer, { context: createContext } ) );
}

export async function startApolloGateway(
	app: Express,
	httpServer: Server,
	supergraphSdl: string,
	buildService: ( s: ServiceEndpointDefinition ) => RemoteGraphQLDataSource,
	createContext: GatewayContextFn,
	logger: Signale,
	plugins: ApolloServerPlugin[]
) {
	logger.pending( `Starting Apollo Gateway...` );
	const apolloServer = new ApolloServer( {
		gateway: new ApolloGateway( { supergraphSdl, buildService } ),
		plugins: [ ApolloServerPluginDrainHttpServer( { httpServer } ), ...plugins ]
	} );

	await apolloServer.start();

	app.use( "/api/graphql", expressMiddleware( apolloServer, { context: createContext } ) );
}