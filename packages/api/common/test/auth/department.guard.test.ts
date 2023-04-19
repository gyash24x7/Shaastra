import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { Request, Response } from "express";
import { Department, MemberPosition } from "@prisma/client";
import { DepartmentGuard, ServiceContext } from "@api/common";
import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from "@nestjs/core";

describe( "Department Guard", () => {
	const mockRequest = mockDeep<Request>();
	const mockResponse = mockDeep<Response>();
	const mockAuthInfo = { id: "userId", position: MemberPosition.CORE, department: Department.WEBOPS };
	const mockServiceContext = mockDeep<ServiceContext>();
	const mockExecutionContext = mockDeep<ExecutionContext>();
	const mockGqlExecutionContext = mockDeep<GqlExecutionContext>();
	const mockGqlContextCreateFn = vi.fn().mockReturnValue( mockGqlExecutionContext );
	const mockReflector = mockDeep<Reflector>();

	beforeEach( () => {
		mockRequest.cookies = { "auth-cookie": "some_jwt_token" };
		mockServiceContext.req = mockRequest;
		mockResponse.locals[ "authInfo" ] = mockAuthInfo;
		mockServiceContext.res = mockResponse;
		mockGqlExecutionContext.getContext.mockReturnValue( mockServiceContext );
		mockGqlExecutionContext.getHandler.mockReturnValue( vi.fn() );
		GqlExecutionContext.create = mockGqlContextCreateFn;
	} );

	it( "should return true when authenticated user is part of specified departments", async () => {
		mockReflector.get.mockReturnValue( [ Department.WEBOPS ] );

		const departmentGuard = new DepartmentGuard( mockReflector );
		const isAuthorized = await departmentGuard.canActivate( mockExecutionContext );

		expect( isAuthorized ).toBeTruthy();
		expect( mockReflector.get ).toHaveBeenCalled();
		expect( mockGqlContextCreateFn ).toHaveBeenCalledWith( mockExecutionContext );
		expect( mockExecutionContext.getHandler ).toHaveBeenCalled();
	} );

	it( "should return false when authenticated user is not part of specified departments", async () => {
		mockReflector.get.mockReturnValue( [ Department.ENVISAGE ] );

		const departmentGuard = new DepartmentGuard( mockReflector );
		const isAuthorized = await departmentGuard.canActivate( mockExecutionContext );

		expect( isAuthorized ).toBeFalsy();
		expect( mockReflector.get ).toHaveBeenCalled();
		expect( mockGqlContextCreateFn ).toHaveBeenCalledWith( mockExecutionContext );
		expect( mockExecutionContext.getHandler ).toHaveBeenCalled();
	} );

	it( "should return false when authInfo not present", async () => {
		mockResponse.locals[ "authInfo" ] = undefined;
		mockServiceContext.res = mockResponse;
		mockGqlExecutionContext.getContext.mockReturnValue( mockServiceContext );
		mockReflector.get.mockReturnValue( [ Department.ENVISAGE ] );

		const departmentGuard = new DepartmentGuard( mockReflector );
		const isAuthorized = await departmentGuard.canActivate( mockExecutionContext );

		expect( isAuthorized ).toBeFalsy();
		expect( mockReflector.get ).toHaveBeenCalled();
		expect( mockGqlContextCreateFn ).toHaveBeenCalledWith( mockExecutionContext );
		expect( mockExecutionContext.getHandler ).toHaveBeenCalled();
	} );

	it( "should return false when department not present in authInfo", async () => {
		mockResponse.locals[ "authInfo" ] = { id: "some_id" };
		mockServiceContext.res = mockResponse;
		mockGqlExecutionContext.getContext.mockReturnValue( mockServiceContext );
		mockReflector.get.mockReturnValue( [ Department.ENVISAGE ] );

		const departmentGuard = new DepartmentGuard( mockReflector );
		const isAuthorized = await departmentGuard.canActivate( mockExecutionContext );

		expect( isAuthorized ).toBeFalsy();
		expect( mockReflector.get ).toHaveBeenCalled();
		expect( mockGqlContextCreateFn ).toHaveBeenCalledWith( mockExecutionContext );
		expect( mockExecutionContext.getHandler ).toHaveBeenCalled();
	} );

	afterEach( () => {
		mockClear( mockExecutionContext );
		mockClear( mockGqlContextCreateFn );
		mockClear( mockGqlExecutionContext );
		mockClear( mockReflector );
	} );
} );