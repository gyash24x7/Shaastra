import type { Request, Response } from "express";

import { mock, mockReset } from "vitest-mock-extended";
import type { JwtService } from "../../src/index.js";
import { deserializeAuthInfo } from "../../src/index.js";

describe( "Deserialize AuthInfo Middleware", function () {

	const mockJwtService = mock<JwtService>();
	const mockRequest = mock<Request>();
	const mockResponse = mock<Response>();
	const mockNextFn = vi.fn();

	const mockAuthInfo = { id: "userId", position: "CORE", department: "WEBOPS" };

	it( "should verify token and set authInfo in res.locals", async () => {
		mockJwtService.extractTokenFromRequestHeaders.calledWith( mockRequest ).mockReturnValue( "some_jwt_token" );
		mockJwtService.verify.calledWith( "some_jwt_token", false ).mockResolvedValue( mockAuthInfo );
		const middleware = deserializeAuthInfo( mockJwtService );

		await middleware( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBe( mockAuthInfo );
		expect( mockJwtService.extractTokenFromRequestHeaders ).toHaveBeenCalledWith( mockRequest );
		expect( mockJwtService.verify ).toHaveBeenCalledWith( "some_jwt_token", false );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	it( "should verify token and set nothing if invalid token", async () => {
		mockJwtService.extractTokenFromRequestHeaders.calledWith( mockRequest ).mockReturnValue( "some_jwt_token" );
		mockJwtService.verify.calledWith( "some_jwt_token", false ).mockResolvedValue( null );

		const middleware = deserializeAuthInfo( mockJwtService );
		await middleware( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBeUndefined();
		expect( mockJwtService.extractTokenFromRequestHeaders ).toHaveBeenCalledWith( mockRequest );
		expect( mockJwtService.verify ).toHaveBeenCalledWith( "some_jwt_token", false );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	it( "should set nothing if no token", async () => {
		mockJwtService.extractTokenFromRequestHeaders.calledWith( mockRequest ).mockReturnValue( undefined );
		mockJwtService.verify.calledWith( "some_jwt_token", false ).mockResolvedValue( null );

		const middleware = deserializeAuthInfo( mockJwtService );
		await middleware( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBeUndefined();
		expect( mockJwtService.extractTokenFromRequestHeaders ).toHaveBeenCalledWith( mockRequest );
		expect( mockJwtService.verify ).toHaveBeenCalledTimes( 0 );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	it( "should extract token from cookies in gateway mode", async () => {
		mockRequest.cookies = { identity: "some_jwt_token" };
		mockJwtService.verify.calledWith( "some_jwt_token", true ).mockResolvedValue( mockAuthInfo );

		const middleware = deserializeAuthInfo( mockJwtService, true );
		await middleware( mockRequest, mockResponse, mockNextFn );

		expect( mockResponse.locals[ "authInfo" ] ).toBe( mockAuthInfo );
		expect( mockJwtService.extractTokenFromRequestHeaders ).toHaveBeenCalledTimes( 0 );
		expect( mockJwtService.verify ).toHaveBeenCalledWith( "some_jwt_token", true );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	afterEach( () => {
		mockResponse.locals = {};
		mockReset( mockJwtService );
	} );

} );