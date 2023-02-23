import type { MiddlewareConsumer } from "@nestjs/common";
import type { MiddlewareConfigProxy } from "@nestjs/common/interfaces";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { AppModule } from "../src/app.module.js";

describe( "App Module", () => {

	const mockMiddlwareConfigProxy = mockDeep<MiddlewareConfigProxy>();
	const mockMiddlewareConsumer = mockDeep<MiddlewareConsumer>();

	it( "should apply all the middlewares", () => {
		mockMiddlewareConsumer.apply.mockReturnValue( mockMiddlwareConfigProxy );
		const appModule = new AppModule();

		appModule.configure( mockMiddlewareConsumer );

		expect( mockMiddlewareConsumer.apply ).toHaveBeenCalledWith( expect.any( Function ) );
		expect( mockMiddlwareConfigProxy.forRoutes ).toHaveBeenCalledWith( "*" );
	} );
} );