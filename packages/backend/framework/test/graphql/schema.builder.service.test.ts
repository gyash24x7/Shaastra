import type { GraphQLResolveInfo } from "graphql";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { generateConfig } from "../../src/config/config.generate.js";
import type { ResolverExplorerService } from "../../src/graphql/resolver.explorer.service.js";
import { SchemaBuilderService } from "../../src/graphql/schema.builder.service.js";

describe( "Schema Builder Service", () => {
	const mockGraphQLResolveInfo = mockDeep<GraphQLResolveInfo>();

	const mockConfig = generateConfig( "test" );
	mockConfig.graphql.schemaPath = "test/graphql/__mocks__/schema.graphql";

	const mockResolverExplorer = mockDeep<ResolverExplorerService>();
	mockResolverExplorer.buildResolversAndPermissions.mockResolvedValue( {
		resolvers: { Query: { exampleQuery: () => "ExampleQuery!" } },
		permissions: {}
	} );

	it( "should build subgraph schema and apply graphql shield", async () => {
		const schemaBuilder = new SchemaBuilderService( mockConfig, mockResolverExplorer );
		const schema = await schemaBuilder.buildSchema();

		expect( schema.getQueryType()?.getFields() ).toBeTruthy();

		const queryFields = schema.getQueryType()?.getFields()!;
		expect( queryFields[ "exampleQuery" ].resolve ).toBeTruthy();

		const resolveFn = queryFields[ "exampleQuery" ].resolve!;

		expect( await resolveFn( {}, {}, {}, mockGraphQLResolveInfo ) ).toBe( "ExampleQuery!" );
		expect( mockResolverExplorer.buildResolversAndPermissions ).toHaveBeenCalled();
	} );

} );