import { buildSubgraphSchema } from "@apollo/subgraph";
import { Injectable } from "@nestjs/common";
import type { GraphQLResolveInfo, GraphQLSchema } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import type { IRule } from "graphql-shield";
import { shield } from "graphql-shield";
import { gql } from "graphql-tag";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DiscoveryService, DiscoveredClassWithMeta } from "../discovery/index.js";
import type { ServiceContext, ResolverFn, ResolverMap, PermissionsMap } from "../utils/index.js";
import { GRAPHQL_RESOLVER_META_KEY, GRAPHQL_SHIELD_META, GRAPHQL_RESOLVER_TYPE } from "./graphql.decorators.js";

@Injectable()
export class SchemaBuilderService {

	private resolvers: ResolverMap = { Query: {}, Mutation: {} };
	private permissions: PermissionsMap = { Query: {}, Mutation: {} };

	constructor( private readonly discoveryService: DiscoveryService ) {}

	registerOperationsAndPermissions( resolverClass: DiscoveredClassWithMeta<boolean> ) {
		const methods = this.discoveryService.classMethodsWithMetaAtKey<string>(
			resolverClass.discoveredClass,
			GRAPHQL_RESOLVER_TYPE
		);

		methods.forEach( resolverMethod => {
			this.registerResolver(
				resolverMethod.meta,
				resolverMethod.discoveredMethod.methodName,
				resolverMethod.discoveredMethod.handler.bind( resolverClass.discoveredClass.instance )
			);

			const shieldMeta = this.discoveryService.getMetaAtKey<IRule>(
				GRAPHQL_SHIELD_META,
				resolverMethod.discoveredMethod
			);

			if ( !!shieldMeta ) {
				this.registerPermissions(
					resolverMethod.meta,
					resolverMethod.discoveredMethod.methodName,
					shieldMeta
				);
			}
		} );
	}

	registerPermissions( resolverType: string, resolverName: string, rule: IRule ) {
		this.permissions = {
			...this.permissions,
			[ resolverType ]: {
				...this.permissions[ resolverType ],
				[ resolverName ]: rule
			}
		};
	}

	registerResolver( resolverType: string, resolverName: string, resolverFn: ResolverFn ) {
		this.resolvers = {
			...this.resolvers,
			[ resolverType ]: {
				...this.resolvers[ resolverType ],
				[ resolverName ]: this.buildResolverFn( resolverFn )
			}
		};
	}

	buildResolverFn( resolver: ResolverFn ) {
		return ( parent: any, args: any, context: ServiceContext, info: GraphQLResolveInfo ) => {
			return resolver( { parent, args, context, info } );
		};
	}

	async buildSchema(): Promise<GraphQLSchema> {
		const typeDefsString = readFileSync( join( process.cwd(), "src/schema.graphql" ), "utf-8" );
		const typeDefs = gql( typeDefsString );

		const resolverClasses = await this.discoveryService.providersWithMetaAtKey<boolean>( GRAPHQL_RESOLVER_META_KEY );
		resolverClasses.forEach( resolverClass => this.registerOperationsAndPermissions( resolverClass ) );

		const subgraph = buildSubgraphSchema( { typeDefs, resolvers: this.resolvers } as any );
		return applyMiddleware( subgraph, shield( this.permissions ) );
	}
}