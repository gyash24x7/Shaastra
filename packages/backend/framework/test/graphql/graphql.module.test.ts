import type { MiddlewareConsumer } from "@nestjs/common";
import { RequestMethod } from "@nestjs/common";
import type { MiddlewareConfigProxy } from "@nestjs/common/interfaces";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { GraphQLModule } from "../../src/graphql";
import type { GraphQLServer } from "../../src/graphql/graphql.server";

describe( "GraphQl Module", () => {
	const mockGraphQLServer = mockDeep<GraphQLServer>();
	const mockMiddlewareConfigProxy = mockDeep<MiddlewareConfigProxy>();
	const mockMiddlewareConsumer = mockDeep<MiddlewareConsumer>();
	const mockGraphQlMiddleware = vi.fn();

	beforeEach( () => {
		mockGraphQLServer.middleware.mockReturnValue( mockGraphQlMiddleware );
		mockMiddlewareConsumer.apply.mockReturnValue( mockMiddlewareConfigProxy );
	} );

	it( "should start graphql server and apply middleware", async () => {
		const graphQLModule = new GraphQLModule( mockGraphQLServer );
		await graphQLModule.configure( mockMiddlewareConsumer );

		expect( mockGraphQLServer.start ).toHaveBeenCalled();
		expect( mockGraphQLServer.middleware ).toHaveBeenCalled();
		expect( mockMiddlewareConsumer.apply ).toHaveBeenCalledWith( mockGraphQlMiddleware );
		expect( mockMiddlewareConfigProxy.forRoutes )
			.toHaveBeenCalledWith( { path: "/api/graphql", method: RequestMethod.POST } );
	} );

	it( "should start graphql server in gateway mode and apply middleware", async () => {
		const graphQLModule = new GraphQLModule( mockGraphQLServer );
		await graphQLModule.configure( mockMiddlewareConsumer );

		expect( mockGraphQLServer.start ).toHaveBeenCalled();
		expect( mockGraphQLServer.middleware ).toHaveBeenCalled();
		expect( mockMiddlewareConsumer.apply ).toHaveBeenCalledWith( mockGraphQlMiddleware );
		expect( mockMiddlewareConfigProxy.forRoutes )
			.toHaveBeenCalledWith( { path: "/api/graphql", method: RequestMethod.POST } );
	} );

	afterEach( () => {
		mockClear( mockGraphQlMiddleware );
		mockClear( mockGraphQLServer );
		mockClear( mockMiddlewareConsumer );
		mockClear( mockMiddlewareConfigProxy );
	} );

} );