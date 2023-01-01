import { ApolloGateway, ServiceEndpointDefinition } from "@apollo/gateway";
import { ServiceDataSource } from "./service.datasource.js";
import { logger } from "../logger/index.js";
import { ApolloServer } from "@apollo/server";
import type { ServiceContext, ServiceContextFn } from "../context/index.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
	ApolloServerPluginLandingPageDisabled,
	ApolloServerPluginUsageReportingDisabled
} from "@apollo/server/plugin/disabled";
import { CookiePlugin } from "./cookie.plugin.js";
import type http from "http";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { gql } from "graphql-tag";
import { buildSubgraphSchema } from "@apollo/subgraph";
import type { Express } from "express";
import { expressMiddleware } from "@apollo/server/express4";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [ key: string ]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	Date: any;
};

export type OperationArgs<I> = { data: I };

export type GraphQLServerOptions = {
	gateway?: boolean;
	httpServer: http.Server;
	resolvers?: any
}

export class GraphQLServer {
	private readonly apolloServer: ApolloServer<ServiceContext>;
	private readonly isGateway: boolean = false;

	constructor( { gateway, httpServer, resolvers }: GraphQLServerOptions ) {
		const plugins = [
			ApolloServerPluginDrainHttpServer( { httpServer } ),
			ApolloServerPluginLandingPageDisabled()
		];

		if ( !!gateway ) {
			const buildService = ( { url }: ServiceEndpointDefinition ) => new ServiceDataSource( { url } );
			this.apolloServer = new ApolloServer<ServiceContext>( {
				gateway: new ApolloGateway( { buildService, logger } ),
				plugins: [ ...plugins, CookiePlugin() ]
			} );

			this.isGateway = true;
		} else {
			plugins.push( ApolloServerPluginUsageReportingDisabled() );
			const typeDefsString = readFileSync( join( process.cwd(), "src/graphql/schema.graphql" ), "utf-8" );
			const typeDefs = gql( typeDefsString );
			let schema = buildSubgraphSchema( { typeDefs, resolvers } as any );
			this.apolloServer = new ApolloServer<ServiceContext>( { logger, schema, plugins } );
		}
	}

	async applyMiddleware( app: Express, context: ServiceContextFn ) {
		await this.apolloServer.start();
		if ( this.isGateway ) {
			app.get( "/api/graphql", ( _, res ) => res.sendFile( join( process.cwd(), "src/assets/graphiql.html" ) ) );
		}
		app.use( "/api/graphql", expressMiddleware( this.apolloServer, { context } ) );
	}
}

export * from "./cookie.plugin.js";
export * from "./service.datasource.js";