import type { MiddlewareConsumer } from "@nestjs/common";
import type { MiddlewareConfigProxy } from "@nestjs/common/interfaces";
import { PrismaClient } from "@prisma/client/connect/index.js";
import type { AppConfig } from "@shaastra/framework";
import { describe, it, expect, test } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { AppModule, prismaClientFactory } from "../src/app.module.js";

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

test( "Prisma Client Factory should return prisma client", async () => {
	const mockConfig = mockDeep<AppConfig>();
	mockConfig.db = { url: "postgresql://user:pass@host:port/db" };
	const client = prismaClientFactory( mockConfig );
	expect( client ).toBeInstanceOf( PrismaClient );
} );