import type { MiddlewareConsumer } from "@nestjs/common";
import type { MiddlewareConfigProxy } from "@nestjs/common/interfaces";
import { describe, it, expect } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { AppModule } from "../src/app.module.js";

describe( "App Module", () => {

	const mockMiddlwareConfigProxy = mockDeep<MiddlewareConfigProxy>();
	const mockMiddlewareConsumer = mockDeep<MiddlewareConsumer>();

	it( "should apply all the middlewares", () => {
		mockMiddlewareConsumer.apply.mockReturnValue( mockMiddlwareConfigProxy );
		const appModule = new AppModule();

		appModule.configure( mockMiddlewareConsumer );

		expect( mockMiddlewareConsumer.apply ).toHaveBeenCalledTimes( 2 );
		expect( mockMiddlewareConsumer.apply )
			.toHaveBeenNthCalledWith( 1, expect.any( Function ), expect.any( Function ) );
		expect( mockMiddlewareConsumer.apply ).toHaveBeenNthCalledWith( 2, expect.any( Function ) );

		expect( mockMiddlwareConfigProxy.forRoutes ).toHaveBeenCalledTimes( 2 );
		expect( mockMiddlwareConfigProxy.forRoutes ).toHaveBeenNthCalledWith( 1, "*" );
		expect( mockMiddlwareConfigProxy.forRoutes ).toHaveBeenNthCalledWith( 2, "/api/auth/logout" );
	} );
} );