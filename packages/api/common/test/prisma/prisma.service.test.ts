import { UserMessages } from "@api/domain";
import type { INestApplication } from "@nestjs/common";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { generateConfig, PrismaExceptionCode, PrismaService } from "../../src";

describe( "PrismaService", () => {

	const mockNestApp = mockDeep<INestApplication>();
	const mockConfig = generateConfig();

	it( "should return close app function when when closeApp is called", async () => {
		const prismaService = new PrismaService( mockConfig );

		const closeFn = prismaService.closeApp( mockNestApp );
		await closeFn();

		expect( mockNestApp.close ).toHaveBeenCalled();
	} );

	it( "should setup shutdown hooks when shutdown hooks are applied", () => {
		const prismaService = new PrismaService( mockConfig );
		prismaService.applyShutdownHooks( mockNestApp );
	} );

	it( "should return exception handler when handleException is called", async () => {
		const prismaService = new PrismaService( mockConfig );
		const handler = prismaService.handleException( {
			code: PrismaExceptionCode.RECORD_NOT_FOUND,
			message: UserMessages.NOT_FOUND
		} );

		let prismaError: Error = new Prisma.PrismaClientKnownRequestError(
			"Not Found",
			{ code: "P2025", clientVersion: "4.12.0" }
		);

		expect.assertions( 7 );
		try {
			handler( prismaError );
		} catch ( e: any ) {
			expect( e ).toBeInstanceOf( NotFoundException );
			expect( e.message ).toBe( UserMessages.NOT_FOUND );
			expect( e.getStatus() ).toBe( 404 );
		}

		prismaError = new Prisma.PrismaClientKnownRequestError(
			"Not Found",
			{ code: "P2020", clientVersion: "4.12.0" }
		);

		try {
			handler( prismaError );
		} catch ( e: any ) {
			expect( e ).toBeInstanceOf( InternalServerErrorException );
			expect( e.getStatus() ).toBe( 500 );
		}

		prismaError = new Error();

		try {
			handler( prismaError );
		} catch ( e: any ) {
			expect( e ).toBeInstanceOf( InternalServerErrorException );
			expect( e.getStatus() ).toBe( 500 );
		}
	} );
} );