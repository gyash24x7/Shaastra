import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { exportJWK, exportPKCS8, exportSPKI, generateKeyPair, JWK, jwtVerify, KeyLike } from "jose";
import { unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import * as process from "node:process";
import { mock, mockReset } from "vitest-mock-extended";
import type { Request } from "express";
import nock from "nock";
import { JwtUtils } from "../../src/index.js";

describe( "JwtUtils", () => {

	const publicKeyPath = "test/auth/__mocks__/keys/.public.key.pem";
	const privateKeyPath = "test/auth/__mocks__/keys/.private.key";
	const signPayload = { id: "1234", roles: [ "POSITION_CORE", "MEMBER_WEBOPS" ], verified: true };

	const mockRequest = mock<Request>();
	let publicKey: KeyLike;
	let privateKey: KeyLike;
	let jwk: JWK;
	let signedToken: string;

	const jwtUtils = new JwtUtils( {
		audience: "api.shaastra.prime",
		domain: "localhost:8000",
		publicKeyPath,
		privateKeyPath
	} );

	beforeAll( async () => {
		const keyPair = await generateKeyPair( "RS256" );
		publicKey = keyPair.publicKey;
		privateKey = keyPair.privateKey;
		await writeFile( join( process.cwd(), privateKeyPath ), await exportPKCS8( privateKey ) );
		await writeFile( join( process.cwd(), publicKeyPath ), await exportSPKI( publicKey ) );

		jwk = await exportJWK( publicKey );

		nock( "http://localhost:8000" ).get( "/api/keys" ).times( 5 ).reply( 200, { keys: [ jwk ] } );
	} );

	it( "should call jwks endpoint to get the JWKs", async () => {
		const jsonWebKey = await jwtUtils.getJwks();
		expect( jsonWebKey.kid ).toBe( jwk.kid );
	} );

	it( "should be able to read public key from file", async () => {
		const key = await jwtUtils.getPublicKey();
		expect( key.type ).toEqual( publicKey.type );
	} );

	it( "should be able to sign a token using private key", async () => {
		signedToken = await jwtUtils.sign( signPayload );
		const { payload } = await jwtVerify( signedToken, publicKey );
		expect( payload[ "id" ] ).toBe( signPayload.id );
	} );

	it( "should return UserAuthInfo after successful token verification", async () => {
		const authInfo = await jwtUtils.verify( signedToken );
		expect( authInfo?.id ).toBe( signPayload.id );
		expect( authInfo?.department ).toBe( "WEBOPS" );
		expect( authInfo?.position ).toBe( "CORE" );
	} );

	it( "should return undefined when token verification is unsuccessful", async () => {
		const randomToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
		const authInfo = await jwtUtils.verify( randomToken );
		expect( authInfo ).toBeUndefined();
	} );

	it( "should be able to extract jwt from request headers", async () => {
		mockRequest.headers.authorization = `Bearer ${ signedToken }`;
		const token = jwtUtils.extractTokenFromRequest( mockRequest );
		expect( token ).toBe( signedToken );
	} );

	afterEach( async () => {
		mockReset( mockRequest );
	} );

	afterAll( async () => {
		await unlink( join( process.cwd(), privateKeyPath ) );
		await unlink( join( process.cwd(), publicKeyPath ) );
	} );

} );