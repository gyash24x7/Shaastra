import type { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import { unlink, writeFile } from "fs/promises";
import type { KeyLike, JWK } from "jose";
import { generateKeyPair, exportPKCS8, exportSPKI, exportJWK, jwtVerify } from "jose";
import nock from "nock";
import { join } from "node:path";

import { mockDeep, mockReset, mock } from "vitest-mock-extended";
import { JwtService, AppConfig } from "../../src/index.js";

describe( "Jwt Service", () => {
	let jwtService: JwtService;
	const mockRequest = mockDeep<Request>();

	const publicKeyPath = "test/auth/__mocks__/keys/.public.key.pem";
	const privateKeyPath = "test/auth/__mocks__/keys/.private.key";
	const signPayload = { id: "1234", roles: [ "POSITION_CORE", "MEMBER_WEBOPS" ], verified: true };

	let publicKey: KeyLike;
	let privateKey: KeyLike;
	let jwk: JWK;
	let signedToken: string;

	beforeAll( async () => {
		const keyPair = await generateKeyPair( "RS256" );
		publicKey = keyPair.publicKey;
		privateKey = keyPair.privateKey;
		await writeFile( join( process.cwd(), privateKeyPath ), await exportPKCS8( privateKey ) );
		await writeFile( join( process.cwd(), publicKeyPath ), await exportSPKI( publicKey ) );

		jwk = await exportJWK( publicKey );
		nock( "http://localhost:8000" ).get( "/api/auth/keys" ).times( 5 ).reply( 200, { keys: [ jwk ] } );

		const mockConfigService = mock<ConfigService<{ app: AppConfig }>>();
		mockConfigService.getOrThrow
			.mockReturnValueOnce( "localhost:8000" )
			.mockReturnValueOnce( "auth.test.audience" )
			.mockReturnValueOnce( privateKeyPath )
			.mockReturnValueOnce( publicKeyPath );

		jwtService = new JwtService( mockConfigService );
	} );

	it( "should call jwks endpoint to get the JWKs", async () => {
		const jsonWebKey = await jwtService.getJwks();
		expect( jsonWebKey.kid ).toBe( jwk.kid );
	} );

	it( "should be able to read public key from file", async () => {
		const key = await jwtService.getPublicKey();
		expect( key.type ).toEqual( publicKey.type );
	} );

	it( "should be able to sign a token using private key", async () => {
		signedToken = await jwtService.sign( signPayload );
		const { payload } = await jwtVerify( signedToken, publicKey );
		expect( payload[ "id" ] ).toBe( signPayload.id );
	} );

	it( "should return UserAuthInfo after successful token verification", async () => {
		const authInfo = await jwtService.verify( signedToken, false );
		expect( authInfo?.id ).toBe( signPayload.id );
		expect( authInfo?.department ).toBe( "WEBOPS" );
		expect( authInfo?.position ).toBe( "CORE" );
	} );

	it( "should return null when token verification is unsuccessful", async () => {
		const randomToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
		const authInfo = await jwtService.verify( randomToken );
		expect( authInfo ).toBeNull();
	} );

	it( "should be able to extract token from request headers", async () => {
		mockRequest.headers.authorization = `Bearer ${ signedToken }`;
		const token = jwtService.extractTokenFromRequestHeaders( mockRequest );
		expect( token ).toBe( signedToken );
	} );

	it( "should not extract token from request headers when scheme is not bearer", async () => {
		mockRequest.headers.authorization = `UnknownScheme ${ signedToken }`;
		const token = jwtService.extractTokenFromRequestHeaders( mockRequest );
		expect( token ).toBeUndefined();
	} );

	it( "should not extract token if no authentication header", async () => {
		mockRequest.headers.authorization = ``;
		const token = jwtService.extractTokenFromRequestHeaders( mockRequest );
		expect( token ).toBeUndefined();
	} );

	it( "should read public key from local in gateway mode", async () => {
		const authInfo = await jwtService.verify( signedToken, true );
		expect( authInfo?.id ).toBe( signPayload.id );
		expect( authInfo?.department ).toBe( "WEBOPS" );
		expect( authInfo?.position ).toBe( "CORE" );
	} );

	afterEach( async () => {
		mockReset( mockRequest );
	} );

	afterAll( async () => {
		await unlink( join( process.cwd(), privateKeyPath ) );
		await unlink( join( process.cwd(), publicKeyPath ) );
	} );

} );