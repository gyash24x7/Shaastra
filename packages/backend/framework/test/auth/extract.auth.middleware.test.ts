import type { Request, Response } from "express";
import { describe, expect, vi, afterEach, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { generateConfig } from "../../src/config/config.generate.js";
import type { JwtService } from "../../src/index.js";
import { ExtractAuthMiddleware } from "../../src/index.js";

describe( "Extract Auth Middleware", function () {
	let mockConfig = generateConfig( "test" );

	const mockJwtService = mockDeep<JwtService>();
	const mockRequest = mockDeep<Request>();
	const mockResponse = mockDeep<Response>();
	const mockNextFn = vi.fn();

	const mockAuthInfo = { id: "userId", position: "CORE", department: "WEBOPS" };

	it( "should verify token and set authInfo in res.locals", async () => {
		mockJwtService.extractTokenFromRequestHeaders.calledWith( mockRequest ).mockReturnValue( "some_jwt_token" );
		mockJwtService.verify.calledWith( "some_jwt_token" ).mockResolvedValue( mockAuthInfo );

		const middleware = new ExtractAuthMiddleware( mockJwtService, mockConfig );
		await middleware.use( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBe( mockAuthInfo );
		expect( mockJwtService.extractTokenFromRequestHeaders ).toHaveBeenCalledWith( mockRequest );
		expect( mockJwtService.verify ).toHaveBeenCalledWith( "some_jwt_token" );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	it( "should verify token and set nothing if invalid token", async () => {
		mockJwtService.extractTokenFromRequestHeaders.calledWith( mockRequest ).mockReturnValue( "some_jwt_token" );
		mockJwtService.verify.calledWith( "some_jwt_token" ).mockResolvedValue( null );

		const middleware = new ExtractAuthMiddleware( mockJwtService, mockConfig );
		await middleware.use( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBeUndefined();
		expect( mockJwtService.extractTokenFromRequestHeaders ).toHaveBeenCalledWith( mockRequest );
		expect( mockJwtService.verify ).toHaveBeenCalledWith( "some_jwt_token" );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	it( "should set nothing if no token", async () => {
		mockJwtService.extractTokenFromRequestHeaders.calledWith( mockRequest ).mockReturnValue( undefined );
		mockJwtService.verify.calledWith( "some_jwt_token" ).mockResolvedValue( null );

		const middleware = new ExtractAuthMiddleware( mockJwtService, mockConfig );
		await middleware.use( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBeUndefined();
		expect( mockJwtService.extractTokenFromRequestHeaders ).toHaveBeenCalledWith( mockRequest );
		expect( mockJwtService.verify ).toHaveBeenCalledTimes( 0 );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	it( "should extract token from cookies when app is gateway", async () => {
		mockRequest.cookies = { identity: "some_jwt_token" };
		mockConfig = generateConfig( "gateway" );
		mockJwtService.verify.calledWith( "some_jwt_token" ).mockResolvedValue( mockAuthInfo );

		const middleware = new ExtractAuthMiddleware( mockJwtService, mockConfig );
		await middleware.use( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBe( mockAuthInfo );
		expect( mockJwtService.extractTokenFromRequestHeaders ).toHaveBeenCalledTimes( 0 );
		expect( mockJwtService.verify ).toHaveBeenCalledWith( "some_jwt_token" );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	afterEach( () => {
		mockResponse.locals = {};
		mockClear( mockJwtService );
		mockClear( mockRequest );
		mockClear( mockResponse );
		mockClear( mockNextFn );
	} );

} );