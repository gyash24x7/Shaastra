import type { HttpException } from "@nestjs/common";
import type { QueryBus } from "@nestjs/cqrs";
import type { User } from "@prisma/client/identity/index.js";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { RequireAuthMiddleware } from "../../src/middlewares/require.auth.middleware.js";
import { UserQuery } from "../../src/queries/user.query.js";

describe( "Require Auth Middleware", () => {

	const mockQueryBus = mockDeep<QueryBus>();
	const mockRequest = mockDeep<Request>();
	const mockResponse = mockDeep<Response>();
	const mockNextFn = vi.fn();

	const mockUser: User = {
		id: "1244",
		email: "abcd@test.com",
		username: "user_name",
		password: bcrypt.hashSync( "some_password", 10 ),
		name: "abcd efgh",
		roles: [],
		verified: true
	};

	it( "should throw exception if authInfo not present", async () => {
		mockResponse.locals[ "authInfo" ] = undefined;
		mockQueryBus.execute.calledWith( expect.any( UserQuery ) ).mockResolvedValue( null );

		const requireAuthMiddleware = new RequireAuthMiddleware( mockQueryBus );

		expect.assertions( 3 );
		await requireAuthMiddleware
			.use( mockRequest, mockResponse, mockNextFn )
			.catch( ( e: HttpException ) => {
				expect( e.getStatus() ).toBe( 401 );
				expect( mockQueryBus.execute ).toHaveBeenCalledTimes( 0 );
				expect( mockNextFn ).toHaveBeenCalledTimes( 0 );
			} );
	} );

	it( "should throw exception if id not present in authInfo", async () => {
		mockResponse.locals[ "authInfo" ] = { id: "", department: "WEBOPS", position: "CORE" };
		mockQueryBus.execute.calledWith( expect.any( UserQuery ) ).mockResolvedValue( null );

		const requireAuthMiddleware = new RequireAuthMiddleware( mockQueryBus );

		expect.assertions( 3 );
		await requireAuthMiddleware
			.use( mockRequest, mockResponse, mockNextFn )
			.catch( ( e: HttpException ) => {
				expect( e.getStatus() ).toBe( 401 );
				expect( mockQueryBus.execute ).toHaveBeenCalledTimes( 0 );
				expect( mockNextFn ).toHaveBeenCalledTimes( 0 );
			} );
	} );

	it( "should throw exception if user not present", async () => {
		mockResponse.locals[ "authInfo" ] = { id: "1244", department: "WEBOPS", position: "CORE" };
		mockQueryBus.execute.calledWith( expect.any( UserQuery ) ).mockResolvedValue( null );

		const requireAuthMiddleware = new RequireAuthMiddleware( mockQueryBus );

		expect.assertions( 3 );
		await requireAuthMiddleware
			.use( mockRequest, mockResponse, mockNextFn )
			.catch( ( e: HttpException ) => {
				expect( e.getStatus() ).toBe( 401 );
				expect( mockQueryBus.execute ).toHaveBeenCalledWith( expect.any( UserQuery ) );
				expect( mockNextFn ).toHaveBeenCalledTimes( 0 );
			} );
	} );

	it( "should call next function if user is present", async () => {
		mockResponse.locals[ "authInfo" ] = { id: "1244", department: "WEBOPS", position: "CORE" };
		mockQueryBus.execute.calledWith( expect.any( UserQuery ) ).mockResolvedValue( mockUser );

		const requireAuthMiddleware = new RequireAuthMiddleware( mockQueryBus );
		await requireAuthMiddleware.use( mockRequest, mockResponse, mockNextFn );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( expect.any( UserQuery ) );
		expect( mockNextFn ).toHaveBeenCalled();
	} );

	afterEach( () => {
		mockClear( mockQueryBus );
	} );
} );