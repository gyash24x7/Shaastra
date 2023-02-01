import type { ConfigService } from "@nestjs/config";
import type { GraphQLResolveInfo } from "graphql";
import { mockDeep } from "vitest-mock-extended";
import type { ResolverExplorerService } from "../../src/graphql/resolver.explorer.service.js";
import { SchemaBuilderService } from "../../src/graphql/schema.builder.service.js";

describe( "Schema Builder Service", () => {
	const mockResolverExplorer = mockDeep<ResolverExplorerService>();
	const mockConfigService = mockDeep<ConfigService>();
	const mockGraphQLResolveInfo = mockDeep<GraphQLResolveInfo>();

	mockConfigService.getOrThrow.mockReturnValueOnce( "test/graphql/__mocks__/schema.graphql" );
	mockResolverExplorer.buildResolversAndPermissions.mockResolvedValue( {
		resolvers: { Query: { exampleQuery: () => "ExampleQuery!" } },
		permissions: {}
	} );

	it( "should build subgraph schema and apply graphql shield", async () => {
		const schemaBuilder = new SchemaBuilderService( mockConfigService, mockResolverExplorer );
		const schema = await schemaBuilder.buildSchema();

		expect( schema.getQueryType()?.getFields() ).toBeTruthy();

		const queryFields = schema.getQueryType()?.getFields()!;
		expect( queryFields[ "exampleQuery" ].resolve ).toBeTruthy();

		const resolveFn = queryFields[ "exampleQuery" ].resolve!;
		expect( await resolveFn( {}, {}, {}, mockGraphQLResolveInfo ) ).toBe( "ExampleQuery!" );

		expect( mockConfigService.getOrThrow ).toHaveBeenCalledWith( "app.graphql.schemaPath" );
		expect( mockResolverExplorer.buildResolversAndPermissions ).toHaveBeenCalled();
	} );

} );