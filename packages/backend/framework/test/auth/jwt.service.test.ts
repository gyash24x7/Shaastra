import type { Request } from "express";
import { unlink, writeFile } from "fs/promises";
import type { KeyLike, JWK } from "jose";
import { generateKeyPair, exportPKCS8, exportSPKI, exportJWK, jwtVerify } from "jose";
import nock from "nock";
import { join } from "node:path";

import { mockDeep, mockReset } from "vitest-mock-extended";
import { generateConfig } from "../../src/config/config.generate.js";
import { JwtService } from "../../src/index.js";

describe( "Jwt Service", () => {
	let mockConfig = generateConfig( "test" );
	mockConfig.auth.publicKeyPath = "test/auth/__mocks__/keys/.public.key.pem";
	mockConfig.auth.privateKeyPath = "test/auth/__mocks__/keys/.private.key";

	const mockRequest = mockDeep<Request>();
	const signPayload = { id: "1234", roles: [ "POSITION_CORE", "MEMBER_WEBOPS" ], verified: true };

	let publicKey: KeyLike;
	let privateKey: KeyLike;
	let jwk: JWK;
	let signedToken: string;

	beforeAll( async () => {
		const keyPair = await generateKeyPair( "RS256" );
		publicKey = keyPair.publicKey;
		privateKey = keyPair.privateKey;
		await writeFile( join( process.cwd(), mockConfig.auth.privateKeyPath ), await exportPKCS8( privateKey ) );
		await writeFile( join( process.cwd(), mockConfig.auth.publicKeyPath ), await exportSPKI( publicKey ) );

		jwk = await exportJWK( publicKey );
		nock( "http://localhost:8000" ).get( "/api/auth/keys" ).times( 5 ).reply( 200, { keys: [ jwk ] } );
	} );

	it( "should call jwks endpoint to get the JWKs", async () => {
		const jwtService = new JwtService( mockConfig );
		const jsonWebKey = await jwtService.getJwks();
		expect( jsonWebKey.kid ).toBe( jwk.kid );
	} );

	it( "should be able to read public key from file", async () => {
		const jwtService = new JwtService( mockConfig );
		const key = await jwtService.getPublicKey();
		expect( key.type ).toEqual( publicKey.type );
	} );

	it( "should be able to sign a token using private key", async () => {
		const jwtService = new JwtService( mockConfig );
		signedToken = await jwtService.sign( signPayload );
		const { payload } = await jwtVerify( signedToken, publicKey );
		expect( payload[ "id" ] ).toBe( signPayload.id );
	} );

	it( "should return UserAuthInfo after successful token verification", async () => {
		const jwtService = new JwtService( mockConfig );
		const authInfo = await jwtService.verify( signedToken );
		expect( authInfo?.id ).toBe( signPayload.id );
		expect( authInfo?.department ).toBe( "WEBOPS" );
		expect( authInfo?.position ).toBe( "CORE" );
	} );

	it( "should return null when token verification is unsuccessful", async () => {
		const jwtService = new JwtService( mockConfig );
		const randomToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
		const authInfo = await jwtService.verify( randomToken );
		expect( authInfo ).toBeNull();
	} );

	it( "should be able to extract token from request headers", async () => {
		const jwtService = new JwtService( mockConfig );
		mockRequest.headers.authorization = `Bearer ${ signedToken }`;
		const token = jwtService.extractTokenFromRequestHeaders( mockRequest );
		expect( token ).toBe( signedToken );
	} );

	it( "should not extract token from request headers when scheme is not bearer", async () => {
		const jwtService = new JwtService( mockConfig );
		mockRequest.headers.authorization = `UnknownScheme ${ signedToken }`;
		const token = jwtService.extractTokenFromRequestHeaders( mockRequest );
		expect( token ).toBeUndefined();
	} );

	it( "should not extract token if no authentication header", async () => {
		const jwtService = new JwtService( mockConfig );
		mockRequest.headers.authorization = ``;
		const token = jwtService.extractTokenFromRequestHeaders( mockRequest );
		expect( token ).toBeUndefined();
	} );

	it( "should read public key from local when app is gateway", async () => {
		mockConfig = generateConfig( "gateway" );
		mockConfig.auth.publicKeyPath = "test/auth/__mocks__/keys/.public.key.pem";
		mockConfig.auth.privateKeyPath = "test/auth/__mocks__/keys/.private.key";
		
		const jwtService = new JwtService( mockConfig );
		const authInfo = await jwtService.verify( signedToken );
		expect( authInfo?.id ).toBe( signPayload.id );
		expect( authInfo?.department ).toBe( "WEBOPS" );
		expect( authInfo?.position ).toBe( "CORE" );
	} );

	afterEach( async () => {
		mockReset( mockRequest );
	} );

	afterAll( async () => {
		await unlink( join( process.cwd(), mockConfig.auth.privateKeyPath ) );
		await unlink( join( process.cwd(), mockConfig.auth.publicKeyPath ) );
	} );

} );