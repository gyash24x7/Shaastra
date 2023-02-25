import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import type { HttpAdapterHost } from "@nestjs/common";
import type { Request, Response } from "express";
import type { GraphQLSchema } from "graphql";
import type { Server } from "node:http";
import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import type { UserAuthInfo } from "../../src/auth";
import { generateConfig } from "../../src/config";
import { buildService, createContext, GraphQLServer } from "../../src/graphql/graphql.server";
import type { SchemaBuilderService } from "../../src/graphql/schema.builder.service";
import type { SchemaPublishService } from "../../src/graphql/schema.publish.service";
import { ServiceDataSource } from "../../src/graphql/service.datasource";

vi.mock( "@apollo/server", () => {
	return { ApolloServer: vi.fn().mockReturnValue( { start: vi.fn() } ) };
} );

vi.mock( "@apollo/server/express4", () => {
	return { expressMiddleware: vi.fn().mockReturnValue( () => "RandomValue!" ) };
} );

vi.mock( "@apollo/gateway", () => {
	return { ApolloGateway: vi.fn(), RemoteGraphQLDataSource: vi.fn() };
} );

vi.mock( "../../src/graphql/service.datasource.ts", () => {
	return { ServiceDataSource: vi.fn() };
} );

test( "BuildService should take url and return ServiceDataSource", async () => {
	const url = "http://localhost:12345";
	const name = "test service";
	buildService( { url, name } );
	expect( ServiceDataSource ).toHaveBeenCalledWith( { url } );
} );

test( "CreateContext should add authInfo to context", async () => {
	const mockRequest = mockDeep<Request>();
	const mockResponse = mockDeep<Response>();
	const mockAuthInfo: UserAuthInfo = { id: "1", department: "WEBOPS", position: "CORE" };
	mockResponse.locals[ "authInfo" ] = mockAuthInfo;

	const ctx = await createContext( { req: mockRequest, res: mockResponse } );

	expect( ctx.authInfo ).toEqual( mockAuthInfo );
} );

describe( "GraphQL Server", () => {

	const mockHttpAdapterHost = mockDeep<HttpAdapterHost>();
	const mockSchemaBuilder = mockDeep<SchemaBuilderService>();
	const mockSchemaPublisher = mockDeep<SchemaPublishService>();
	const mockSchema = mockDeep<GraphQLSchema>();
	const mockHttpServer = mockDeep<Server>();

	beforeEach( () => {
		mockSchemaBuilder.buildSchema.mockResolvedValue( mockSchema );
		mockHttpAdapterHost.httpAdapter.getHttpServer.mockReturnValue( mockHttpServer );
	} );

	it( "should return 3 plugins when in service mode", () => {
		const mockConfig = generateConfig( "test" );
		const graphQLServer = new GraphQLServer(
			mockHttpAdapterHost,
			mockSchemaBuilder,
			mockSchemaPublisher,
			mockConfig
		);
		const plugins = graphQLServer.getPlugins();

		expect( plugins ).toHaveLength( 3 );
		expect( mockHttpAdapterHost.httpAdapter.getHttpServer ).toHaveBeenCalled();
	} );

	it( "should return 2 plugin when in gateway mode", () => {
		const mockConfig = generateConfig( "gateway" );
		const graphQLServer = new GraphQLServer(
			mockHttpAdapterHost,
			mockSchemaBuilder,
			mockSchemaPublisher,
			mockConfig
		);
		const plugins = graphQLServer.getPlugins();

		expect( plugins ).toHaveLength( 2 );
		expect( mockHttpAdapterHost.httpAdapter.getHttpServer ).toHaveBeenCalled();
	} );

	it( "should run apollo server with gateway in gateway mode", async () => {
		const mockConfig = generateConfig( "gateway" );
		const graphQLServer = new GraphQLServer(
			mockHttpAdapterHost,
			mockSchemaBuilder,
			mockSchemaPublisher,
			mockConfig
		);
		await graphQLServer.start();

		expect( mockSchemaBuilder.buildSchema ).toHaveBeenCalledTimes( 0 );
		expect( mockSchemaPublisher.publishSchema ).toHaveBeenCalledTimes( 0 );
		expect( mockHttpAdapterHost.httpAdapter.getHttpServer ).toHaveBeenCalled();
		expect( ApolloGateway ).toHaveBeenCalledWith(
			expect.objectContaining( {
				buildService: expect.any( Function )
			} )
		);
		expect( ApolloServer ).toHaveBeenCalledWith(
			expect.objectContaining( {
				gateway: expect.any( ApolloGateway )
			} )
		);
	} );

	it( "should return apollo server with schema in service mode", async () => {
		const mockConfig = generateConfig( "test" );
		const graphQLServer = new GraphQLServer(
			mockHttpAdapterHost,
			mockSchemaBuilder,
			mockSchemaPublisher,
			mockConfig
		);
		await graphQLServer.start();

		expect( mockSchemaBuilder.buildSchema ).toHaveBeenCalledTimes( 1 );
		expect( mockSchemaPublisher.publishSchema ).toHaveBeenCalledTimes( 1 );
		expect( mockHttpAdapterHost.httpAdapter.getHttpServer ).toHaveBeenCalled();
		expect( ApolloGateway ).toHaveBeenCalledTimes( 0 );
		expect( ApolloServer ).toHaveBeenCalledWith(
			expect.objectContaining( {
				schema: mockSchema
			} )
		);
	} );

	it( "should return express middleware function", async () => {
		const mockConfig = generateConfig( "test" );
		const graphQLServer = new GraphQLServer(
			mockHttpAdapterHost,
			mockSchemaBuilder,
			mockSchemaPublisher,
			mockConfig
		);
		await graphQLServer.start();
		const middleware = graphQLServer.middleware();

		const mockRequest = mockDeep<Request>();
		const mockResponse = mockDeep<Response>();
		const mockNextFn = vi.fn();

		expect( expressMiddleware ).toHaveBeenCalledWith(
			expect.objectContaining( { start: expect.any( Function ) } ),
			expect.objectContaining( { context: expect.any( Function ) } )
		);

		expect( middleware( mockRequest, mockResponse, mockNextFn ) ).toBe( "RandomValue!" );
	} );

	afterEach( () => {
		mockClear( mockSchemaBuilder );
		mockClear( mockSchemaPublisher );
		mockClear( ApolloServer );
		mockClear( ApolloGateway );
		mockClear( mockHttpAdapterHost );
		mockClear( mockHttpServer );
		mockClear( mockSchema );
		mockClear( RemoteGraphQLDataSource );
		mockClear( expressMiddleware );
	} );
} );