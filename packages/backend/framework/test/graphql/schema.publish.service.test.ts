import shelljs from "shelljs";
import { describe, expect, it, vi } from "vitest";
import { SchemaPublishService } from "../../src/graphql/schema.publish.service.js";
import { generateConfig } from "../../src/index.js";

vi.mock( "shelljs", async ( importOriginal ) => {
	const actual = await importOriginal<typeof shelljs>();
	const mocked = { ...actual, exec: vi.fn().mockReturnValue( { code: 0, stdout: "" } ) };
	return { default: mocked };
} );

describe( "Schema Publish Service", () => {
	const config = generateConfig( "test" );

	it( "should execute rover command to publish subgraph", async () => {
		const schemaPublishService = new SchemaPublishService( config );
		schemaPublishService.publishSchema();
		expect( shelljs.exec ).toHaveBeenCalled();
	} );
} );