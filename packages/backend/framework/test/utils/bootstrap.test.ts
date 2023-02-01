import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { mockDeep, mockReset, anyObject, DeepMockProxy } from "vitest-mock-extended";
import type { WithShutdownHook } from "../../src/index.js";
import { bootstrap } from "../../src/index.js";

class MockAppModule {}

class MockPrismaService implements WithShutdownHook {
	applyShutdownHooks = vi.fn();
}

describe( "Bootstrap Method", () => {
	let mockNestApp: DeepMockProxy<NestExpressApplication>;
	let mockCreateFn: Mock;
	const mockConfigService = mockDeep<ConfigService>();
	const mockPrismaService = mockDeep<MockPrismaService>();

	beforeEach( () => {
		mockNestApp = mockDeep<NestExpressApplication>();
		mockCreateFn = vi.fn().mockReturnValue( mockNestApp );
		NestFactory.create = mockCreateFn;
	} );

	it( "should start the application successfully!", async () => {
		mockConfigService.getOrThrow
			.mockReturnValueOnce( 7000 )
			.mockReturnValueOnce( "Shaastra Test" )
			.mockReturnValueOnce( "http://localhost:8000" )
			.mockReturnValueOnce( "test" )
			.mockReturnValueOnce( "localhost" )
			.mockReturnValueOnce( 6379 );

		mockNestApp.get.calledWith( ConfigService ).mockReturnValue( mockConfigService );
		mockNestApp.get.calledWith( MockPrismaService ).mockReturnValue( mockPrismaService );

		await bootstrap( MockAppModule, MockPrismaService );

		expect( mockCreateFn ).toHaveBeenCalledWith( MockAppModule, anyObject() );
		expect( mockNestApp.get ).toHaveBeenCalledWith( ConfigService );
		expect( mockNestApp.get ).toHaveBeenCalledWith( MockPrismaService );
		expect( mockNestApp.enableCors ).toHaveBeenCalledTimes( 0 );
		expect( mockNestApp.use ).toHaveBeenCalledTimes( 2 );
		expect( mockNestApp.connectMicroservice ).toHaveBeenCalledWith( {
			transport: Transport.REDIS,
			options: { host: "localhost", port: 6379 }
		} );
		expect( mockPrismaService.applyShutdownHooks ).toHaveBeenCalledWith( mockNestApp );
		expect( mockNestApp.startAllMicroservices ).toHaveBeenCalled();
		expect( mockNestApp.listen ).toHaveBeenCalledWith( 7000 );
	} );

	it( "should enable cors if gateway!", async () => {
		mockConfigService.getOrThrow
			.mockReturnValueOnce( 7000 )
			.mockReturnValueOnce( "Shaastra Gateway" )
			.mockReturnValueOnce( "http://localhost:8000" )
			.mockReturnValueOnce( "gateway" )
			.mockReturnValueOnce( "localhost" )
			.mockReturnValueOnce( 6379 );

		mockNestApp.get.calledWith( ConfigService ).mockReturnValue( mockConfigService );
		mockNestApp.get.calledWith( MockPrismaService ).mockReturnValue( mockPrismaService );

		await bootstrap( MockAppModule, MockPrismaService );

		expect( mockCreateFn ).toHaveBeenCalledWith( MockAppModule, anyObject() );
		expect( mockNestApp.get ).toHaveBeenCalledWith( ConfigService );
		expect( mockNestApp.get ).toHaveBeenCalledWith( MockPrismaService );
		expect( mockNestApp.enableCors ).toHaveBeenCalledWith( { origin: "http://localhost:3000", credentials: true } );
		expect( mockNestApp.use ).toHaveBeenCalledTimes( 2 );
		expect( mockNestApp.connectMicroservice ).toHaveBeenCalledWith( {
			transport: Transport.REDIS,
			options: { host: "localhost", port: 6379 }
		} );
		expect( mockPrismaService.applyShutdownHooks ).toHaveBeenCalledWith( mockNestApp );
		expect( mockNestApp.startAllMicroservices ).toHaveBeenCalled();
		expect( mockNestApp.listen ).toHaveBeenCalledWith( 7000 );
	} );

	afterEach( () => {
		mockReset( mockConfigService );
		mockReset( mockNestApp );
	} );
} );