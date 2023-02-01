import { BadRequestException, HttpStatus, NotFoundException } from "@nestjs/common";
import type { User, Token } from "@prisma/client/identity/index.js";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { VerifyUserCommandHandler, VerifyUserInput } from "../../src/commands/verify.user.command.js";
import { TokenMessages, UserMessages } from "../../src/constants/messages.js";
import type { PrismaService } from "../../src/prisma/prisma.service.js";

describe( "Verify User Command Handler", () => {

	const mockPrismaService = mockDeep<PrismaService>();

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
		mockPrismaService.user.findUnique.mockResolvedValue( mockUser );
		mockPrismaService.token.findFirst.mockResolvedValue( mockToken );
		mockPrismaService.user.update.mockResolvedValue( { ...mockUser, verified: true } );
		mockPrismaService.token.delete.mockResolvedValue( mockToken );

		const verifyUserCommandHandler = new VerifyUserCommandHandler( mockPrismaService );
		const updatedUser = await verifyUserCommandHandler.execute( { data: mockVerifyUserInput } );

		expect( mockPrismaService.user.findUnique ).toHaveBeenCalledWith( {
			where: { id: mockVerifyUserInput.userId }
		} );

		expect( mockPrismaService.token.findFirst ).toHaveBeenCalledWith( {
			where: { userId: mockVerifyUserInput.userId, hash: mockVerifyUserInput.hash }
		} );

		expect( mockPrismaService.user.update ).toHaveBeenCalledWith( {
			where: { id: mockVerifyUserInput.userId },
			data: { verified: true }
		} );

		expect( mockPrismaService.token.delete ).toHaveBeenCalledWith( { where: { id: mockToken.id } } );

		expect( updatedUser.id ).toBe( mockUser.id );
		expect( updatedUser.verified ).toBe( true );
	} );

	it( "should throw exception if token already expired", async () => {
		mockPrismaService.user.findUnique.mockResolvedValue( mockUser );
		mockPrismaService.token.findFirst.mockResolvedValue( {
			...mockToken, expiry: dayjs().subtract( 2, "days" ).toDate()
		} );

		const verifyUserCommandHandler = new VerifyUserCommandHandler( mockPrismaService );
		await verifyUserCommandHandler
			.execute( { data: mockVerifyUserInput } )
			.catch( ( e: BadRequestException ) => {
				expect( e.message ).toBe( TokenMessages.EXPIRED );
				expect( e.getStatus() ).toBe( HttpStatus.BAD_REQUEST );

				expect( mockPrismaService.user.findUnique ).toHaveBeenCalledWith( {
					where: { id: mockVerifyUserInput.userId }
				} );

				expect( mockPrismaService.token.findFirst ).toHaveBeenCalledWith( {
					where: { userId: mockVerifyUserInput.userId, hash: mockVerifyUserInput.hash }
				} );

				expect( mockPrismaService.user.update ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.token.delete ).toHaveBeenCalledTimes( 0 );
			} );
	} );

	it( "should throw exception if token not found", async () => {
		mockPrismaService.user.findUnique.mockResolvedValue( mockUser );
		mockPrismaService.token.findFirst.mockResolvedValue( null );

		const verifyUserCommandHandler = new VerifyUserCommandHandler( mockPrismaService );
		await verifyUserCommandHandler
			.execute( { data: mockVerifyUserInput } )
			.catch( ( e: NotFoundException ) => {
				expect( e.message ).toBe( TokenMessages.NOT_FOUND );
				expect( e.getStatus() ).toBe( HttpStatus.NOT_FOUND );

				expect( mockPrismaService.user.findUnique ).toHaveBeenCalledWith( {
					where: { id: mockVerifyUserInput.userId }
				} );

				expect( mockPrismaService.token.findFirst ).toHaveBeenCalledWith( {
					where: { userId: mockVerifyUserInput.userId, hash: mockVerifyUserInput.hash }
				} );

				expect( mockPrismaService.user.update ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.token.delete ).toHaveBeenCalledTimes( 0 );
			} );
	} );

	it( "should throw exception if user not found", async () => {
		mockPrismaService.user.findUnique.mockResolvedValue( null );

		const verifyUserCommandHandler = new VerifyUserCommandHandler( mockPrismaService );
		await verifyUserCommandHandler
			.execute( { data: mockVerifyUserInput } )
			.catch( ( e: BadRequestException ) => {
				expect( e.message ).toBe( UserMessages.NOT_FOUND );
				expect( e.getStatus() ).toBe( HttpStatus.NOT_FOUND );

				expect( mockPrismaService.user.findUnique ).toHaveBeenCalledWith( {
					where: { id: mockVerifyUserInput.userId }
				} );

				expect( mockPrismaService.token.findFirst ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.user.update ).toHaveBeenCalledTimes( 0 );
				expect( mockPrismaService.token.delete ).toHaveBeenCalledTimes( 0 );
			} );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
	} );
} );