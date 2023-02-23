import { Injectable, Scope } from "@nestjs/common";
import { DiscoveryService, MetadataScanner } from "@nestjs/core";
import { STATIC_CONTEXT } from "@nestjs/core/injector/constants.js";
import type { GraphQLResolveInfo } from "graphql";
import type { IRule } from "graphql-shield";
import { GRAPHQL_OPERATION_TYPE, GRAPHQL_RESOLVER_TYPE, GRAPHQL_SHIELD_META } from "./graphql.decorators.js";
import type {
	DiscoveredOperation,
	DiscoveredProvider,
	DiscoveredResolver,
	OperationType,
	PermissionsMap,
	ResolverFn,
	ResolverMap,
	ServiceContext
} from "./graphql.types.js";

export function buildResolverFn( resolver: ResolverFn ) {
	return ( parent: any, args: any, context: ServiceContext, info: GraphQLResolveInfo ) => {
		return resolver( { parent, args, context, info } );
	};
}

@Injectable()
export class ResolverExplorerService {

	constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly metadataScanner: MetadataScanner
	) {}

	async discoverResolvers(): Promise<DiscoveredResolver[]> {
		const resolvers = await Promise.all( this.discoveryService.getProviders()
			.filter( provider => provider.scope !== Scope.REQUEST )
			.map( async ( wrapper ): Promise<DiscoveredProvider> => {
				const instanceHost = wrapper.getInstanceByContextId( STATIC_CONTEXT, wrapper.id );

				if ( instanceHost.isPending && !instanceHost.isResolved ) {
					await instanceHost.donePromise;
				}

				return {
					name: wrapper.name as string,
					instance: instanceHost.instance,
					injectType: wrapper.metatype,
					dependencyType: instanceHost.instance?.constructor
				};
			} )
		);

		return resolvers
			.filter( resolver => !!this.getResolverType( resolver ) )
			.map( resolver => {
				const resolverType = this.getResolverType( resolver )!;
				return { ...resolver, resolverType, instance: resolver.instance! };
			} );
	}

	discoverOperations( { instance }: DiscoveredResolver ): Array<DiscoveredOperation> {
		const prototype = Object.getPrototypeOf( instance );

		const discoveredOperations = this.metadataScanner.getAllMethodNames( prototype ).map( ( name ) => {
			const handler = prototype[ name ];
			const operationType: OperationType = Reflect.getMetadata( GRAPHQL_OPERATION_TYPE, handler );
			return { operationType, handler, name };
		} );

		return discoveredOperations.filter( x => !!x.operationType );
	}

	async buildResolversAndPermissions() {
		const resolvers: ResolverMap = {};
		const permissions: PermissionsMap = {};

		const resolverClasses = await this.discoverResolvers();
		resolverClasses.forEach( resolverClass => {
			this.discoverOperations( resolverClass ).forEach( ( { operationType, name, handler } ) => {
				let resolverType: string = resolverClass.resolverType;

				if ( resolverType !== "Query" && resolverType !== "Mutation" ) {
					if ( operationType === "ResolveReference" ) {
						name = "__resolveReference";
					}
				} else if ( resolverType !== operationType ) {
					resolverType = operationType;
				}

				if ( !resolvers[ resolverType ] ) {
					resolvers[ resolverType ] = {};
				}

				resolvers[ resolverType ][ name ] = buildResolverFn( handler.bind( resolverClass.instance ) );

				const shieldMeta: IRule | undefined = Reflect.getMetadata( GRAPHQL_SHIELD_META, handler );
				if ( !!shieldMeta ) {

					if ( !permissions[ resolverType ] ) {
						permissions[ resolverType ] = {};
					}

					permissions[ resolverType ][ name ] = shieldMeta;
				}
			} );
		} );

		return { resolvers, permissions };
	}

	private getResolverType( provider: DiscoveredProvider ): string | undefined {
		if ( !provider.instance?.constructor ) {
			return;
		}

		return Reflect.getMetadata( GRAPHQL_RESOLVER_TYPE, provider.instance.constructor );
	}
}