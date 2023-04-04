import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Mock } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { anyObject, DeepMockProxy, mockClear, mockDeep } from "vitest-mock-extended";
import { bootstrap, CONFIG_DATA, generateConfig, PrismaService } from "../../src";

class MockAppModule {}

class MockPrismaService {
	applyShutdownHooks = vi.fn();
}

describe( "Bootstrap Method", () => {
	let mockNestApp: DeepMockProxy<NestExpressApplication>;
	let mockCreateFn: Mock;

	let mockConfig = generateConfig();
	const mockPrismaService = new MockPrismaService();

	beforeEach( () => {
		mockNestApp = mockDeep<NestExpressApplication>();
		mockCreateFn = vi.fn().mockReturnValue( mockNestApp );
		NestFactory.create = mockCreateFn;
	} );

	it( "should enable cors if gateway", async () => {
		mockConfig = generateConfig();
		mockNestApp.get.calledWith( CONFIG_DATA ).mockReturnValue( mockConfig );
		mockNestApp.get.calledWith( PrismaService ).mockReturnValue( mockPrismaService );

		await bootstrap( MockAppModule );

		expect( mockCreateFn ).toHaveBeenCalledWith( MockAppModule, anyObject() );
		expect( mockNestApp.get ).toHaveBeenCalledWith( CONFIG_DATA );
		expect( mockNestApp.get ).toHaveBeenCalledWith( PrismaService );
		expect( mockNestApp.enableCors ).toHaveBeenCalledWith( { origin: "http://localhost:3000", credentials: true } );
		expect( mockNestApp.use ).toHaveBeenCalledTimes( 3 );
		expect( mockPrismaService.applyShutdownHooks ).toHaveBeenCalledWith( mockNestApp );
		expect( mockNestApp.listen ).toHaveBeenCalledWith( 8000 );
	} );

	afterEach( () => {
		mockClear( mockNestApp );
	} );
} );