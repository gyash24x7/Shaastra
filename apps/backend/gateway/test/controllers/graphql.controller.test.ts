import type { Response } from "express";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { GraphQLController } from "../../src/controllers";

describe( "GraphQL Controller", () => {

	it( "should return graphiql.html when request is received", async () => {
		const graphQLController = new GraphQLController();
		const mockResponse = mockDeep<Response>();

		graphQLController.renderGraphiql( mockResponse );

		expect( mockResponse.sendFile ).toHaveBeenCalled();
	} );
} );