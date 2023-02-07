import type { INestApplication } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { PrismaService } from "../../src/index.js";
import type { PrismaClientLike } from "../../src/prisma/prisma.interfaces.js";

describe( "PrismaService", () => {

	const mockPrismaClient = mockDeep<PrismaClientLike>();
	const mockNestApp = mockDeep<INestApplication>();

	it( "should be instialized with client and apply middlewares", () => {
		const prismaService = new PrismaService( mockPrismaClient );

		expect( prismaService.client ).toBe( mockPrismaClient );
		expect( mockPrismaClient.$use ).toHaveBeenCalledWith( expect.any( Function ) );
	} );

	it( "should return close app function when when closeApp is called", async () => {
		const prismaService = new PrismaService( mockPrismaClient );

		const closeFn = prismaService.closeApp( mockNestApp );
		await closeFn();

		expect( mockNestApp.close ).toHaveBeenCalled();
	} );

	it( "should setup shutdown hooks when shutdown hooks are applied", () => {
		const prismaService = new PrismaService( mockPrismaClient );

		prismaService.applyShutdownHooks( mockNestApp );

		expect( mockPrismaClient.$on ).toHaveBeenCalledWith( "beforeExit", expect.any( Function ) );
	} );
} );