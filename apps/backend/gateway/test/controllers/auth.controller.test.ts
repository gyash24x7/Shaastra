import type { JwtService } from "@app/framework/auth";
import type { CommandBus } from "@nestjs/cqrs";
import bcrypt from "bcryptjs";
import type { Response } from "express";
import { generateKeyPair } from "jose";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import type { User } from "../../prisma/generated";
import { LoginCommand, LoginInput, VerifyUserCommand, VerifyUserInput } from "../../src/commands";
import { accessTokenCookieOptions, AuthController } from "../../src/controllers";

describe( "Auth Controller", () => {
	const mockJwtService = mockDeep<JwtService>();
	const mockCommandBus = mockDeep<CommandBus>();

	const mockUser: User = {
		id: "1244",
		email: "abcd@test.com",
		username: "user_name",
		password: bcrypt.hashSync( "some_password", 10 ),
		name: "abcd efgh",
		roles: [],
		verified: true
	};

	it( "should return JSON Web Keys when jwks request is received", async () => {
		const keyPair = await generateKeyPair( "RS256" );
		const publicKey = keyPair.publicKey;

		const authController = new AuthController( mockJwtService, mockCommandBus );
		mockJwtService.getPublicKey.mockResolvedValue( publicKey );

		const res = await authController.getJWKs();

		expect( mockJwtService.getPublicKey ).toHaveBeenCalled();
		expect( res.keys.length ).toBe( 1 );
	} );

	it( "should execute login command and set cookie when login request is received", async () => {
		const authController = new AuthController( mockJwtService, mockCommandBus );
		const mockResponse = mockDeep<Response>();
		mockResponse.status.calledWith( 200 ).mockReturnValue( mockResponse );

		mockCommandBus.execute.calledWith( expect.any( LoginCommand ) )
			.mockResolvedValue( { token: "access_token", user: mockUser } );

		const mockLoginInput: LoginInput = { username: "user_name", password: "some_password" };
		await authController.login( mockLoginInput, mockResponse );

		expect( mockCommandBus.execute ).toHaveBeenCalledWith( expect.any( LoginCommand ) );
		expect( mockResponse.cookie ).toHaveBeenCalledWith( "identity", "access_token", accessTokenCookieOptions );
		expect( mockResponse.status ).toHaveBeenCalledWith( 200 );
		expect( mockResponse.send ).toHaveBeenCalledWith( mockUser );
	} );

	it( "should execute verify user command and redirect to login page on email verification request", async () => {
		const authController = new AuthController( mockJwtService, mockCommandBus );
		const mockResponse = mockDeep<Response>();
		const mockVerifyUserInput: VerifyUserInput = { userId: "1234", hash: "some_random_hash" };

		await authController.verifyEmail( mockVerifyUserInput, mockResponse );

		expect( mockCommandBus.execute ).toHaveBeenCalledWith( expect.any( VerifyUserCommand ) );
		expect( mockResponse.redirect ).toHaveBeenCalledWith( "http://localhost:3000/auth/login" );
	} );

	it( "should clear cookie when logout request is received", async () => {
		const authController = new AuthController( mockJwtService, mockCommandBus );
		const mockResponse = mockDeep<Response>();

		await authController.logout( mockResponse );
		expect( mockResponse.clearCookie ).toHaveBeenCalledWith( "identity" );
	} );

	afterEach( () => {
		mockClear( mockCommandBus );
		mockClear( mockJwtService );
	} );
} );