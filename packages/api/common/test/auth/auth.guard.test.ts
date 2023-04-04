import type { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request, Response } from "express";
import { describe, expect, it, Mock, vi } from "vitest";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { AuthGuard, JwtService, ServiceContext } from "../../src";

describe( "Auth Guard", () => {

	const mockJwtService = mockDeep<JwtService>();
	const mockRequest = mockDeep<Request>();
	const mockResponse = mockDeep<Response>();
	const mockAuthInfo = { id: "userId", position: "CORE", department: "WEBOPS" };
	const mockServiceContext = mockDeep<ServiceContext>();
	let mockExecutionContext: DeepMockProxy<ExecutionContext>;
	let mockGqlExecutionContext: DeepMockProxy<GqlExecutionContext>;
	let mockGqlContextCreateFn: Mock<[ ExecutionContext ], GqlExecutionContext>;

	function buildMocks() {
		mockServiceContext.req = mockRequest;
		mockServiceContext.res = mockResponse;
		mockExecutionContext = mockDeep<ExecutionContext>();
		mockGqlExecutionContext = mockDeep<GqlExecutionContext>();
		mockGqlExecutionContext.getContext.mockReturnValue( mockServiceContext );
		mockGqlContextCreateFn = vi.fn().mockReturnValue( mockGqlExecutionContext );
		GqlExecutionContext.create = mockGqlContextCreateFn;
	}

	it( "should extract token from cookies when app is gateway", async () => {
		mockRequest.cookies = { "auth-cookie": "some_jwt_token" };
		buildMocks();
		mockJwtService.verify.calledWith( "some_jwt_token" ).mockResolvedValue( mockAuthInfo );

		const middleware = new AuthGuard( mockJwtService );
		await middleware.canActivate( mockExecutionContext );

		expect( mockResponse.locals[ "authInfo" ] ).toBe( mockAuthInfo );
		expect( mockGqlContextCreateFn ).toHaveBeenCalledWith( mockExecutionContext );
		expect( mockGqlExecutionContext.getContext ).toHaveBeenCalled();
		expect( mockJwtService.extractTokenFromRequestHeaders ).toHaveBeenCalledTimes( 0 );
		expect( mockJwtService.verify ).toHaveBeenCalledWith( "some_jwt_token" );
	} );
} );