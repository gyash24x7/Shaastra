import { mockDeep } from "vitest-mock-extended";
import type { LoggerService } from "../../src/logger/logger.service.js";
import type { PrismaMiddlewareParams } from "../../src/prisma/prisma.interfaces.js";
import { prismaLoggingMiddleware } from "../../src/prisma/prisma.middleware.js";

describe( "Prisma Logging Middleware Function", () => {

	const mockLoggerService = mockDeep<LoggerService>();
	const mockMiddlewareParams: PrismaMiddlewareParams = {
		args: undefined,
		dataPath: [],
		runInTransaction: false,
		model: "Model",
		action: "findOne"
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