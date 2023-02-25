import { exec } from "shelljs";
import { describe, expect, it, vi } from "vitest";
import { generateConfig } from "../../src/config";
import { SchemaPublishService } from "../../src/graphql/schema.publish.service";

vi.mock( "shelljs", async () => {

	return { exec: vi.fn().mockReturnValue( { code: 0, stdout: "" } ) };
} );

describe( "Schema Publish Service", () => {
	const config = generateConfig( "test" );

	it( "should execute rover command to publish subgraph", async () => {
		const schemaPublishService = new SchemaPublishService( config );
		schemaPublishService.publishSchema();
		expect( exec ).toHaveBeenCalled();
	} );
} );