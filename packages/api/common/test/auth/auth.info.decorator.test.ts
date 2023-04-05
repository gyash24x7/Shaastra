import type { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { authInfoDecoratorFn, ServiceContext, UserAuthInfo } from "../../src";

describe( "AuthInfo Decorator", () => {

	const mockAuthInfo: UserAuthInfo = { id: "userId", position: "CORE", department: "WEBOPS" };
	const mockServiceContext = mockDeep<ServiceContext>();

	const mockResponse = mockDeep<Response>();
	mockResponse.locals[ "authInfo" ] = mockAuthInfo;
	mockServiceContext.res = mockResponse;

	const mockExecutionContext = mockDeep<ExecutionContext>();
	const mockGqlExecutionContext = mockDeep<GqlExecutionContext>();
	mockGqlExecutionContext.getContext.mockReturnValue( mockServiceContext );

	const mockGqlContextCreateFn = vi.fn().mockReturnValue( mockGqlExecutionContext );
	GqlExecutionContext.create = mockGqlContextCreateFn;

	it( "should return authInfo from res.locals", async () => {
		const authInfo = authInfoDecoratorFn( {}, mockExecutionContext );

		expect( authInfo ).toBe( mockAuthInfo );
		expect( mockGqlContextCreateFn ).toHaveBeenCalledWith( mockExecutionContext );
		expect( mockGqlExecutionContext.getContext ).toHaveBeenCalled();
	} );
} );