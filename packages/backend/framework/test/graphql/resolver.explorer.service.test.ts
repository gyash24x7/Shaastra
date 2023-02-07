import { Scope, Type } from "@nestjs/common";
import { DiscoveryService, MetadataScanner } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper.js";
import type { GraphQLResolveInfo } from "graphql";
import { not } from "graphql-shield";
import { test, describe, expect, vi, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { ResolverExplorerService, buildResolverFn } from "../../src/graphql/resolver.explorer.service.js";
import {
	Resolver,
	Query,
	Mutation,
	FieldResolver,
	ResolveReference,
	GraphQLShield,
	isAuthenticated,
	ServiceContext
} from "../../src/index.js";

@Resolver( "Query" )
export class ExampleQueryResolver {
	@Query()
	exampleQuery() {
		return "ExampleQuery";
	}

	@Mutation()
	@GraphQLShield( isAuthenticated )
	exampleMutation2() {
		return "ExampleMutation2";
	}
}

@Resolver( "Mutation" )
export class ExampleMutationResolver {
	@Mutation()
	@GraphQLShield( isAuthenticated )
	exampleMutation() {
		return "ExampleMutation";
	}
}

@Resolver( "ExampleType" )
export class ExampleTypeResolver {
	@FieldResolver()
	@GraphQLShield( not( isAuthenticated ) )
	exampleFieldResolver() {
		return "ExampleTypeFieldResolver";
	}

	@ResolveReference()
	exampleResolveReference() {
		return "ExampleTypeResolveReference";
	}
}

test( "BuildResolverFn should take default graphql resolver params and pass as object", async () => {
	const mockResolverFn = vi.fn();
	const mockContext = mockDeep<ServiceContext>();
	const mockInfo = mockDeep<GraphQLResolveInfo>();
	const builtResolverFn = buildResolverFn( mockResolverFn );

	builtResolverFn( {}, {}, mockContext, mockInfo );

	expect( mockResolverFn ).toHaveBeenCalledWith( { parent: {}, args: {}, context: mockContext, info: mockInfo } );
} );

describe( "Resolver Explorer Service", () => {

	const discoveryService = mockDeep<DiscoveryService>();
	const metadataScanner = new MetadataScanner();

	const providers = Array
		.of<Type>( ExampleQueryResolver, ExampleTypeResolver, ExampleMutationResolver )
		.map( ( ResolverType ) => new InstanceWrapper( {
			scope: Scope.DEFAULT,
			getInstanceByContextId: vi.fn().mockReturnValue( {
				instance: new ResolverType(),
				donePromise: undefined,
				isPending: false,
				isResolved: true
			} ),
			name: ResolverType.name,
			metatype: ResolverType
		} ) );

	providers.push( new InstanceWrapper( {
		scope: Scope.TRANSIENT,
		getInstanceByContextId: vi.fn().mockReturnValue( {
			donePromise: Promise.resolve(),
			isPending: true,
			isResolved: false
		} )
	} ) );

	discoveryService.getProviders.mockReturnValue( providers );

	it( "should discover graphql shield rules attached to operations", async () => {
		const resolverExplorer = new ResolverExplorerService( discoveryService, metadataScanner );
		const { permissions } = await resolverExplorer.buildResolversAndPermissions();

		expect( discoveryService.getProviders ).toBeCalled();

		expect( permissions ).toEqual( {
			Mutation: {
				exampleMutation: expect.anything(),
				exampleMutation2: expect.anything()
			},
			ExampleType: { exampleFieldResolver: expect.anything() }
		} );
	} );

	it( "should discover all the resolvers and register the operations", async () => {
		const resolverExplorer = new ResolverExplorerService( discoveryService, metadataScanner );
		const { resolvers } = await resolverExplorer.buildResolversAndPermissions();

		expect( discoveryService.getProviders ).toBeCalled();

		expect( resolvers ).toEqual( {
			Query: { exampleQuery: expect.any( Function ) },
			Mutation: {
				exampleMutation: expect.any( Function ),
				exampleMutation2: expect.any( Function )
			},
			ExampleType: {
				exampleFieldResolver: expect.any( Function ),
				__resolveReference: expect.any( Function )
			}
		} );

		const queryFn: Function = resolvers[ "Query" ][ "exampleQuery" ];
		expect( queryFn() ).toBe( "ExampleQuery" );

		const mutationFn1: Function = resolvers[ "Mutation" ][ "exampleMutation" ];
		expect( mutationFn1() ).toBe( "ExampleMutation" );

		const mutationFn2: Function = resolvers[ "Mutation" ][ "exampleMutation2" ];
		expect( mutationFn2() ).toBe( "ExampleMutation2" );

		const fieldResolverFn: Function = resolvers[ "ExampleType" ][ "exampleFieldResolver" ];
		expect( fieldResolverFn() ).toBe( "ExampleTypeFieldResolver" );

		const resolveReferenceFn: Function = resolvers[ "ExampleType" ][ "__resolveReference" ];
		expect( resolveReferenceFn() ).toBe( "ExampleTypeResolveReference" );
	} );
} );