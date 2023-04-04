import type { Prisma } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import type { LoggerService } from "../../src/logger/logger.service";
import { prismaLoggingMiddleware } from "../../src/prisma/prisma.middleware";

describe( "Prisma Logging Middleware Function", () => {

	const mockLoggerService = mockDeep<LoggerService>();
	const mockMiddlewareParams: Prisma.MiddlewareParams = {
		args: undefined,
		dataPath: [],
		runInTransaction: false,
		model: "User",
		action: "findFirst"
	};
	const mockMiddlewareNextFn = vi.fn().mockImplementation( ( params ) => params );

	it( "should return a prisma middleware to log the query time", async () => {
		const middleware = prismaLoggingMiddleware( mockLoggerService );
		const result = await middleware( mockMiddlewareParams, mockMiddlewareNextFn );

		expect( mockLoggerService.debug ).toHaveBeenCalled();
		expect( mockMiddlewareNextFn ).toHaveBeenCalledWith( mockMiddlewareParams );
		expect( result ).toEqual( mockMiddlewareParams );
	} );
} );