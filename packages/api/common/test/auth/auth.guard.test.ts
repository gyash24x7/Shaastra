import type { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Department, Position } from "@prisma/client";
import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { AuthGuard, AuthPayload, JwtService, ServiceContext } from "../../src";

describe( "Auth Guard", () => {

	it( "should extract token from cookies and set authInfo", async () => {
		const mockJwtService = mockDeep<JwtService>();
		const mockRequest = mockDeep<Request>();
		const mockResponse = mockDeep<Response>();
		const mockAuthInfo = { id: "userId", position: Position.CORE, department: Department.WEBOPS };
		const mockAuthPayload = mockDeep<AuthPayload>();
		mockAuthPayload.roles = [ "MEMBER_WEBOPS", "POSITION_CORE" ];
		const mockServiceContext = mockDeep<ServiceContext>();
		const mockExecutionContext = mockDeep<ExecutionContext>();
		const mockGqlExecutionContext = mockDeep<GqlExecutionContext>();
		const mockGqlContextCreateFn = vi.fn().mockReturnValue( mockGqlExecutionContext );

		mockRequest.cookies = { "auth-cookie": "some_jwt_token" };
		mockServiceContext.req = mockRequest;
		mockServiceContext.res = mockResponse;
		mockGqlExecutionContext.getContext.mockReturnValue( mockServiceContext );
		GqlExecutionContext.create = mockGqlContextCreateFn;
		mockJwtService.verify.calledWith( "some_jwt_token" ).mockResolvedValue( {
			authInfo: mockAuthInfo,
			authPayload: mockAuthPayload
		} );

		const middleware = new AuthGuard( mockJwtService );
		await middleware.canActivate( mockExecutionContext );

		expect( mockResponse.locals[ "authInfo" ] ).toBe( mockAuthInfo );
		expect( mockGqlContextCreateFn ).toHaveBeenCalledWith( mockExecutionContext );
		expect( mockGqlExecutionContext.getContext ).toHaveBeenCalled();
		expect( mockJwtService.extractTokenFromRequestHeaders ).toHaveBeenCalledTimes( 0 );
		expect( mockJwtService.verify ).toHaveBeenCalledWith( "some_jwt_token" );
	} );
} );