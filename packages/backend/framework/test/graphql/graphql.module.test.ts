import type { MiddlewareConsumer } from "@nestjs/common";
import { RequestMethod } from "@nestjs/common";
import type { MiddlewareConfigProxy } from "@nestjs/common/interfaces";
import { vi } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import type { GraphQLServer } from "../../src/graphql/graphql.server.js";
import { GraphQLModule } from "../../src/index.js";

describe( "GraphQl Module", () => {
	const mockGraphQLServer = mockDeep<GraphQLServer>();
	const mockMiddlwareConfigProxy = mockDeep<MiddlewareConfigProxy>();
	const mockMiddlewareConsumer = mockDeep<MiddlewareConsumer>();
	const mockGraphQlMiddleware = vi.fn();

	beforeEach( () => {
		mockGraphQLServer.middleware.mockReturnValue( mockGraphQlMiddleware );
		mockMiddlewareConsumer.apply.mockReturnValue( mockMiddlwareConfigProxy );
	} );

	it( "should start graphql server and apply middleware", async () => {
		const graphQLModule = new GraphQLModule( mockGraphQLServer );
		await graphQLModule.configure( mockMiddlewareConsumer );

		expect( mockGraphQLServer.start ).toHaveBeenCalled();
		expect( mockGraphQLServer.middleware ).toHaveBeenCalled();
		expect( mockMiddlewareConsumer.apply ).toHaveBeenCalledWith( mockGraphQlMiddleware );
		expect( mockMiddlwareConfigProxy.forRoutes )
			.toHaveBeenCalledWith( { path: "/api/graphql", method: RequestMethod.POST } );
	} );

	it( "should start graphql server in gateway mode and apply middleware", async () => {
		const graphQLModule = new GraphQLModule( mockGraphQLServer );
		await graphQLModule.configure( mockMiddlewareConsumer );

		expect( mockGraphQLServer.start ).toHaveBeenCalled();
		expect( mockGraphQLServer.middleware ).toHaveBeenCalled();
		expect( mockMiddlewareConsumer.apply ).toHaveBeenCalledWith( mockGraphQlMiddleware );
		expect( mockMiddlwareConfigProxy.forRoutes )
			.toHaveBeenCalledWith( { path: "/api/graphql", method: RequestMethod.POST } );
	} );

	afterEach( () => {
		mockClear( mockGraphQlMiddleware );
		mockClear( mockGraphQLServer );
		mockClear( mockMiddlewareConsumer );
		mockClear( mockMiddlwareConfigProxy );
	} );

} );