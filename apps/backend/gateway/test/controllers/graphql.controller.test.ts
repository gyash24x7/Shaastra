import type { Response } from "express";
import { join } from "node:path";
import process from "node:process";
import { mockDeep } from "vitest-mock-extended";
import { GraphQLController } from "../../src/controllers/graphql.controller.js";

describe( "GraphQL Controller", () => {

	it( "should return graphiql.html when request is received", async () => {
		const graphQLController = new GraphQLController();
		const mockResponse = mockDeep<Response>();

		graphQLController.renderGraphiql( mockResponse );

		expect( mockResponse.sendFile ).toHaveBeenCalledWith( join( process.cwd(), "src/assets/graphiql.html" ) );
	} );
} );