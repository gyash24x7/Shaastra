import { BadRequestException, HttpStatus, NotFoundException } from "@nestjs/common";
import type { User } from "@prisma/client/identity";
import type { JwtService } from "@shaastra/framework";
import bcrypt from "bcryptjs";
import { mockDeep, mockClear } from "vitest-mock-extended";
import type { LoginInput } from "../../src/commands/login.command.js";
import { LoginCommandHandler } from "../../src/commands/login.command.js";
import { UserMessages } from "../../src/constants/messages.js";
import type { PrismaService } from "../../src/prisma/prisma.service.js";

describe( "Login Command Handler", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockJwtService = mockDeep<JwtService>();

	const mockLoginInput: LoginInput = {
		username: "user_name",
		password: "some_password"
	};

	const mockUser: User = {
		id: "1244",
		email: "abcd@test.com",
		username: "user_name",
		password: bcrypt.hashSync( "some_password", 10 ),
		name: "abcd efgh",
		roles: [],
		verified: true
	};

	it( "should login new user and return access token with user details", async () => {
		mockPrismaService.user.findUnique.mockResolvedValue( mockUser );
		mockJwtService.sign.mockResolvedValue( "mock_token" );

		const loginCommandHandler = new LoginCommandHandler( mockPrismaService, mockJwtService );
		const { user, token } = await loginCommandHandler.execute( { data: mockLoginInput } );

		expect( mockPrismaService.user.findUnique ).toHaveBeenCalledWith( {
			where: { username: mockLoginInput.username }
		} );

		expect( mockJwtService.sign ).toHaveBeenCalledWith(
			{ id: mockUser.id, verified: mockUser.verified, roles: mockUser.roles }
		);

		expect( user ).toEqual( mockUser );
		expect( token ).toBe( "mock_token" );
	} );

	it( "should throw exception if passwords don't match", async () => {
		mockPrismaService.user.findUnique.mockResolvedValue( mockUser );
		mockJwtService.sign.mockResolvedValue( "mock_token" );

		const loginCommandHandler = new LoginCommandHandler( mockPrismaService, mockJwtService );
		await loginCommandHandler
			.execute( { data: { ...mockLoginInput, password: "wrong_password" } } )
			.catch( ( e: BadRequestException ) => {
				expect( e.message ).toBe( UserMessages.INVALID_CREDENTIALS );
				expect( e.getStatus() ).toBe( HttpStatus.BAD_REQUEST );

				expect( mockPrismaService.user.findUnique ).toHaveBeenCalledWith( {
					where: { username: mockLoginInput.username }
				} );

				expect( mockJwtService.sign ).toHaveBeenCalledTimes( 0 );
			} );
	} );

	it( "should throw exception if user is not verified", async () => {
		mockPrismaService.user.findUnique.mockResolvedValue( { ...mockUser, verified: false } );
		mockJwtService.sign.mockResolvedValue( "mock_token" );

		const loginCommandHandler = new LoginCommandHandler( mockPrismaService, mockJwtService );
		await loginCommandHandler
			.execute( { data: mockLoginInput } )
			.catch( ( e: BadRequestException ) => {
				expect( e.message ).toBe( UserMessages.NOT_VERIFIED );
				expect( e.getStatus() ).toBe( HttpStatus.BAD_REQUEST );

				expect( mockPrismaService.user.findUnique ).toHaveBeenCalledWith( {
					where: { username: mockLoginInput.username }
				} );

				expect( mockJwtService.sign ).toHaveBeenCalledTimes( 0 );
			} );
	} );

	it( "should throw exception if user not found", async () => {
		mockPrismaService.user.findUnique.mockResolvedValue( null );
		mockJwtService.sign.mockResolvedValue( "mock_token" );

		const loginCommandHandler = new LoginCommandHandler( mockPrismaService, mockJwtService );
		await loginCommandHandler
			.execute( { data: mockLoginInput } )
			.catch( ( e: NotFoundException ) => {
				expect( e.message ).toBe( UserMessages.NOT_FOUND );
				expect( e.getStatus() ).toBe( HttpStatus.NOT_FOUND );

				expect( mockPrismaService.user.findUnique ).toHaveBeenCalledWith( {
					where: { username: mockLoginInput.username }
				} );

				expect( mockJwtService.sign ).toHaveBeenCalledTimes( 0 );
			} );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
		mockClear( mockJwtService );
	} );
} );