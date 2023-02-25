import type { PrismaService } from "@app/framework/prisma";
import { HttpException, HttpStatus } from "@nestjs/common";
import type { PrismaClient, Token, User } from "@prisma/client/gateway";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { VerifyUserCommandHandler, VerifyUserInput } from "../../src/commands";
import { TokenMessages, UserMessages } from "../../src/constants";

describe( "Verify User Command Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();

	const mockUser: User = {
		id: "1244",
		email: "abcd@test.com",
		username: "user_name",
		password: bcrypt.hashSync( "some_password", 10 ),
		name: "abcd efgh",
		roles: [],
		verified: false
	};

	const mockToken: Token = {
		id: "mock_token_id",
		hash: "mock_token_hash",
		expiry: dayjs().add( 2, "days" ).toDate(),
		userId: "1244",
		createdAt: dayjs().toDate()
	};

	const mockVerifyUserInput: VerifyUserInput = {
		userId: "1244",
		hash: "mock_token_hash"
	};

	it( "should update the user if verification successful", async () => {
		mockPrismaService.client.user.findUnique.mockResolvedValue( mockUser );
		mockPrismaService.client.token.findFirst.mockResolvedValue( mockToken );
		mockPrismaService.client.user.update.mockResolvedValue( { ...mockUser, verified: true } );
		mockPrismaService.client.token.delete.mockResolvedValue( mockToken );

		const verifyUserCommandHandler = new VerifyUserCommandHandler( mockPrismaService );
		const updatedUser = await verifyUserCommandHandler.execute( { data: mockVerifyUserInput } );

		expect( mockPrismaService.client.token.delete ).toHaveBeenCalledWith( { where: { id: mockToken.id } } );
		expect( updatedUser.id ).toBe( mockUser.id );
		expect( updatedUser.verified ).toBe( true );
		expect( mockPrismaService.client.user.findUnique ).toHaveBeenCalledWith( {
			where: { id: mockVerifyUserInput.userId }
		} );

		expect( mockPrismaService.client.token.findFirst ).toHaveBeenCalledWith( {
			where: { userId: mockVerifyUserInput.userId, hash: mockVerifyUserInput.hash }
		} );

		expect( mockPrismaService.client.user.update ).toHaveBeenCalledWith( {
			where: { id: mockVerifyUserInput.userId },
			data: { verified: true }
		} );
	} );

	it( "should throw exception if token already expired", async () => {
		mockPrismaService.client.user.findUnique.mockResolvedValue( mockUser );
		mockPrismaService.client.token.findFirst.mockResolvedValue( {
			...mockToken, expiry: dayjs().subtract( 2, "days" ).toDate()
		} );

		const verifyUserCommandHandler = new VerifyUserCommandHandler( mockPrismaService );

		expect.assertions( 6 );
		await verifyUserCommandHandler
			.execute( { data: mockVerifyUserInput } )
			.catch( ( e: HttpException ) => {
				expect( e.message ).toBe( TokenMessages.EXPIRED );
				expect( e.getStatus() ).toBe( HttpStatus.BAD_REQUEST );
				expect( mockPrismaService.client.user.update ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.client.token.delete ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.client.user.findUnique ).toHaveBeenCalledWith( {
					where: { id: mockVerifyUserInput.userId }
				} );

				expect( mockPrismaService.client.token.findFirst ).toHaveBeenCalledWith( {
					where: { userId: mockVerifyUserInput.userId, hash: mockVerifyUserInput.hash }
				} );
			} );
	} );

	it( "should throw exception if token not found", async () => {
		mockPrismaService.client.user.findUnique.mockResolvedValue( mockUser );
		mockPrismaService.client.token.findFirst.mockResolvedValue( null );

		const verifyUserCommandHandler = new VerifyUserCommandHandler( mockPrismaService );

		expect.assertions( 6 );
		await verifyUserCommandHandler
			.execute( { data: mockVerifyUserInput } )
			.catch( ( e: HttpException ) => {
				expect( e.message ).toBe( TokenMessages.NOT_FOUND );
				expect( e.getStatus() ).toBe( HttpStatus.NOT_FOUND );
				expect( mockPrismaService.client.user.update ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.client.token.delete ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.client.user.findUnique ).toHaveBeenCalledWith( {
					where: { id: mockVerifyUserInput.userId }
				} );

				expect( mockPrismaService.client.token.findFirst ).toHaveBeenCalledWith( {
					where: { userId: mockVerifyUserInput.userId, hash: mockVerifyUserInput.hash }
				} );
			} );
	} );

	it( "should throw exception if user not found", async () => {
		mockPrismaService.client.user.findUnique.mockResolvedValue( null );

		const verifyUserCommandHandler = new VerifyUserCommandHandler( mockPrismaService );

		expect.assertions( 6 );
		await verifyUserCommandHandler
			.execute( { data: mockVerifyUserInput } )
			.catch( ( e: HttpException ) => {
				expect( e.message ).toBe( UserMessages.NOT_FOUND );
				expect( e.getStatus() ).toBe( HttpStatus.NOT_FOUND );
				expect( mockPrismaService.client.token.findFirst ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.client.user.update ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.client.token.delete ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.client.user.findUnique ).toHaveBeenCalledWith( {
					where: { id: mockVerifyUserInput.userId }
				} );
			} );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
	} );
} );