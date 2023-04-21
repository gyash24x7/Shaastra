import type { Request } from "express";
import { unlink, writeFile } from "fs/promises";
import type { JWK, KeyLike } from "jose";
import { exportJWK, exportPKCS8, exportSPKI, generateKeyPair, jwtVerify } from "jose";
import nock from "nock";
import { join } from "node:path";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { mockDeep, mockReset } from "vitest-mock-extended";
import { generateConfig, JwtService } from "../../src";

describe( "Jwt Service", () => {
	let mockConfig = generateConfig();
	mockConfig.auth.publicKeyPath = "../../test/auth/__mocks__/.public.key.pem";
	mockConfig.auth.privateKeyPath = "../../test/auth/__mocks__/.private.key";

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
		await writeFile( join( __dirname, mockConfig.auth.privateKeyPath ), await exportPKCS8( privateKey ) );
		await writeFile( join( __dirname, mockConfig.auth.publicKeyPath ), await exportSPKI( publicKey ) );

		jwk = await exportJWK( publicKey );
		nock( "http://localhost:8000" ).get( "/api/auth/keys" ).times( 5 ).reply( 200, { keys: [ jwk ] } );
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
		const { authInfo } = await jwtService.verify( signedToken );
		expect( authInfo?.id ).toBe( signPayload.id );
		expect( authInfo?.department ).toBe( "WEBOPS" );
		expect( authInfo?.position ).toBe( "CORE" );
	} );

	it( "should return undefined when token verification is unsuccessful", async () => {
		const jwtService = new JwtService( mockConfig );
		const randomToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
		const { authInfo } = await jwtService.verify( randomToken );
		expect( authInfo ).toBeUndefined();
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

	afterEach( async () => {
		mockReset( mockRequest );
	} );

	afterAll( async () => {
		await unlink( join( __dirname, mockConfig.auth.privateKeyPath ) );
		await unlink( join( __dirname, mockConfig.auth.publicKeyPath ) );
	} );

} );