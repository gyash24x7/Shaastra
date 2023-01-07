import { afterEach, describe, expect, it, vi } from "vitest";
import { mock, mockReset } from "vitest-mock-extended";
import type { JwtUtils } from "../../src/index.js";
import { deserializeUser } from "../../src/index.js";
import type { Request, Response } from "express";

describe( "Deserialize User Middleware", function () {

	const mockJwtUtils = mock<JwtUtils>();
	const mockRequest = mock<Request>();
	const mockResponse = mock<Response>();
	const mockNextFn = vi.fn();

	const mockAuthInfo = { id: "userId", position: "CORE", department: "WEBOPS" };

	it( "should verify token and set authInfo in res.locals", async () => {
		mockJwtUtils.extractTokenFromRequest.mockReturnValue( "some_jwt_token" );
		mockJwtUtils.verify.mockResolvedValue( mockAuthInfo );
		const middleware = deserializeUser( mockJwtUtils );

		await middleware( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBe( mockAuthInfo );
		expect( mockJwtUtils.extractTokenFromRequest ).toHaveBeenCalledWith( mockRequest );
		expect( mockJwtUtils.verify ).toHaveBeenCalledWith( "some_jwt_token" );
		expect( mockNextFn ).toHaveBeenCalled();
	} );


	it( "should verify token and set nothing if invalid token", async () => {
		mockJwtUtils.extractTokenFromRequest.mockReturnValue( "some_jwt_token" );
		mockJwtUtils.verify.mockResolvedValue( undefined );
		const middleware = deserializeUser( mockJwtUtils );

		await middleware( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBeUndefined();
		expect( mockJwtUtils.extractTokenFromRequest ).toHaveBeenCalledWith( mockRequest );
		expect( mockJwtUtils.verify ).toHaveBeenCalledWith( "some_jwt_token" );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	it( "should set nothing if no token", async () => {
		mockJwtUtils.extractTokenFromRequest.mockReturnValue( undefined );
		mockJwtUtils.verify.mockResolvedValue( undefined );
		const middleware = deserializeUser( mockJwtUtils );

		await middleware( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBeUndefined();
		expect( mockJwtUtils.extractTokenFromRequest ).toHaveBeenCalledWith( mockRequest );
		expect( mockJwtUtils.verify ).toHaveBeenCalledTimes( 0 );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	afterEach( () => {
		mockReset( mockJwtUtils );
		mockReset( mockRequest );
		mockReset( mockResponse );
	} );

} );