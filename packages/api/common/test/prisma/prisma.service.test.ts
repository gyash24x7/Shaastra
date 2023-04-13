import type { INestApplication } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { generateConfig, PrismaService } from "../../src";

describe( "PrismaService", () => {

	const mockNestApp = mockDeep<INestApplication>();
	const mockConfig = generateConfig();

	it( "should return close app function when when closeApp is called", async () => {
		const prismaService = new PrismaService( mockConfig );

		const closeFn = prismaService.closeApp( mockNestApp );
		await closeFn();

		expect( mockNestApp.close ).toHaveBeenCalled();
	} );

	it( "should setup shutdown hooks when shutdown hooks are applied", () => {
		const prismaService = new PrismaService( mockConfig );
		prismaService.applyShutdownHooks( mockNestApp );
	} );
} );