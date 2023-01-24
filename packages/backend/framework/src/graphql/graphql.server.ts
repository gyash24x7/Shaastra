import type { ServiceEndpointDefinition } from "@apollo/gateway";
import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import {
	ApolloServerPluginLandingPageDisabled,
	ApolloServerPluginUsageReportingDisabled
} from "@apollo/server/plugin/disabled";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { BeforeApplicationShutdown, Injectable } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { gql } from "graphql-tag";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { GraphQLResolverParams, ServiceContext } from "../utils/index.js";
import { LandingPagePlugin } from "./landing.page.plugin.js";
import { ServiceDataSource } from "./service.datasource.js";
import { LoggerFactory } from "../logger/index.js";
import type { GraphQLResolveInfo } from "graphql/type/index.js";

export type ResolverFn = ( param: GraphQLResolverParams ) => any;

function buildResolverFn( resolver: ResolverFn ) {
	return ( parent: any, args: any, context: ServiceContext, info: GraphQLResolveInfo ) => {
		return resolver( { parent, args, context, info } );
	};
}

@Injectable()
export class GraphQLServer implements BeforeApplicationShutdown {
	private readonly logger = LoggerFactory.getLogger( GraphQLServer );
	private resolvers: any = {};
	private apolloServer: ApolloServer<ServiceContext>;

	constructor( private readonly httpAdapterHost: HttpAdapterHost ) {}

	registerResolver( resolverType: string, resolverName: string, resolverFn: ResolverFn ) {
		this.logger.debug( "Resolver Registered!" );
		this.resolvers = {
			...this.resolvers,
			[ resolverType ]: {
				...this.resolvers[ resolverType ],
				[ resolverName ]: buildResolverFn( resolverFn )
			}
		};
	}

	async start( isGateway: boolean = false ) {
		this.logger.debug( "Starting GraphQL Server..." );
		this.logger.debug( this.resolvers );
		const plugins = this.getPlugins( isGateway );

		if ( isGateway ) {
			const buildService = ( { url }: ServiceEndpointDefinition ) => new ServiceDataSource( { url } );
			const gateway = new ApolloGateway( { buildService, logger: this.logger } );
			this.apolloServer = new ApolloServer<ServiceContext>( { gateway, plugins, logger: this.logger } );
		} else {
			const typeDefsString = readFileSync( join( process.cwd(), "src/schema.graphql" ), "utf-8" );
			const typeDefs = gql( typeDefsString );
			const schema = buildSubgraphSchema( { typeDefs, resolvers: this.resolvers } );
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