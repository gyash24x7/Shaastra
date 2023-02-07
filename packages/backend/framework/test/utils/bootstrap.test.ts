import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Mock } from "vitest";
import { describe, expect, vi, afterEach, beforeEach, it } from "vitest";

import { mockDeep, anyObject, DeepMockProxy, mockClear } from "vitest-mock-extended";
import { generateConfig } from "../../src/config/config.generate.js";
import { bootstrap, CONFIG_DATA, PRISMA_SERVICE } from "../../src/index.js";

class MockAppModule {}

class MockPrismaService {
	applyShutdownHooks = vi.fn();
}

describe( "Bootstrap Method", () => {
	let mockNestApp: DeepMockProxy<NestExpressApplication>;
	let mockCreateFn: Mock;

	let mockConfig = generateConfig( "test" );
	const mockPrismaService = new MockPrismaService();

	beforeEach( () => {
		mockNestApp = mockDeep<NestExpressApplication>();
		mockCreateFn = vi.fn().mockReturnValue( mockNestApp );
		NestFactory.create = mockCreateFn;
	} );

	it( "should start the application successfully", async () => {
		mockNestApp.get.calledWith( CONFIG_DATA ).mockReturnValue( mockConfig );
		mockNestApp.get.calledWith( PRISMA_SERVICE ).mockReturnValue( mockPrismaService );

		await bootstrap( MockAppModule );

		expect( mockCreateFn ).toHaveBeenCalledWith( MockAppModule, anyObject() );
		expect( mockNestApp.get ).toHaveBeenCalledWith( CONFIG_DATA );
		expect( mockNestApp.get ).toHaveBeenCalledWith( PRISMA_SERVICE );
		expect( mockNestApp.enableCors ).toHaveBeenCalledTimes( 0 );
		expect( mockNestApp.use ).toHaveBeenCalledTimes( 2 );
		expect( mockNestApp.connectMicroservice ).toHaveBeenCalledWith( {
			transport: Transport.REDIS,
			options: { host: "localhost", port: 6379 }
		} );
		expect( mockPrismaService.applyShutdownHooks ).toHaveBeenCalledWith( mockNestApp );
		expect( mockNestApp.startAllMicroservices ).toHaveBeenCalled();
		expect( mockNestApp.listen ).toHaveBeenCalledWith( 8000 );
	} );

	it( "should enable cors if gateway", async () => {
		mockConfig = generateConfig( "gateway" );
		mockNestApp.get.calledWith( CONFIG_DATA ).mockReturnValue( mockConfig );
		mockNestApp.get.calledWith( PRISMA_SERVICE ).mockReturnValue( mockPrismaService );

		await bootstrap( MockAppModule );

		expect( mockCreateFn ).toHaveBeenCalledWith( MockAppModule, anyObject() );
		expect( mockNestApp.get ).toHaveBeenCalledWith( CONFIG_DATA );
		expect( mockNestApp.get ).toHaveBeenCalledWith( PRISMA_SERVICE );
		expect( mockNestApp.enableCors ).toHaveBeenCalledWith( { origin: "http://localhost:3000", credentials: true } );
		expect( mockNestApp.use ).toHaveBeenCalledTimes( 2 );
		expect( mockNestApp.connectMicroservice ).toHaveBeenCalledWith( {
			transport: Transport.REDIS,
			options: { host: "localhost", port: 6379 }
		} );
		expect( mockPrismaService.applyShutdownHooks ).toHaveBeenCalledWith( mockNestApp );
		expect( mockNestApp.startAllMicroservices ).toHaveBeenCalled();
		expect( mockNestApp.listen ).toHaveBeenCalledWith( 8000 );
	} );

	afterEach( () => {
		mockClear( mockNestApp );
	} );
} );