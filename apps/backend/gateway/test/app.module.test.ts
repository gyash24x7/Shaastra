import type { MiddlewareConsumer } from "@nestjs/common";
import type { MiddlewareConfigProxy } from "@nestjs/common/interfaces";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { AppModule } from "../src/app.module";

describe( "App Module", () => {

	const mockMiddlewareConfigProxy = mockDeep<MiddlewareConfigProxy>();
	const mockMiddlewareConsumer = mockDeep<MiddlewareConsumer>();

	it( "should apply all the middlewares", () => {
		mockMiddlewareConsumer.apply.mockReturnValue( mockMiddlewareConfigProxy );
		const appModule = new AppModule();

		appModule.configure( mockMiddlewareConsumer );

		expect( mockMiddlewareConsumer.apply ).toHaveBeenCalledTimes( 2 );
		expect( mockMiddlewareConsumer.apply )
			.toHaveBeenNthCalledWith( 1, expect.any( Function ), expect.any( Function ) );
		expect( mockMiddlewareConsumer.apply ).toHaveBeenNthCalledWith( 2, expect.any( Function ) );

		expect( mockMiddlewareConfigProxy.forRoutes ).toHaveBeenCalledTimes( 2 );
		expect( mockMiddlewareConfigProxy.forRoutes ).toHaveBeenNthCalledWith( 1, "*" );
		expect( mockMiddlewareConfigProxy.forRoutes ).toHaveBeenNthCalledWith( 2, "/api/auth/logout" );
	} );
} );
