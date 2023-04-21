import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { Request, Response } from "express";
import { Department, Position } from "@prisma/client";
import { AuthPayload, RolesGuard, ServiceContext } from "@api/common";
import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from "@nestjs/core";

describe( "Roles Guard", () => {
	const mockRequest = mockDeep<Request>();
	const mockResponse = mockDeep<Response>();
	const mockAuthInfo = { id: "userId", position: Position.CORE, roles: Department.WEBOPS };
	const mockServiceContext = mockDeep<ServiceContext>();
	const mockExecutionContext = mockDeep<ExecutionContext>();
	const mockGqlExecutionContext = mockDeep<GqlExecutionContext>();
	const mockGqlContextCreateFn = vi.fn().mockReturnValue( mockGqlExecutionContext );
	const mockReflector = mockDeep<Reflector>();
	const mockAuthPayload = mockDeep<AuthPayload>();
	mockAuthPayload.roles = [ "MEMBER_WEBOPS", "POSITION_CORE" ];

	beforeEach( () => {
		mockRequest.cookies = { "auth-cookie": "some_jwt_token" };
		mockServiceContext.req = mockRequest;
		mockResponse.locals[ "authInfo" ] = mockAuthInfo;
		mockResponse.locals[ "authPayload" ] = mockAuthPayload;
		mockServiceContext.res = mockResponse;
		mockGqlExecutionContext.getContext.mockReturnValue( mockServiceContext );
		mockGqlExecutionContext.getHandler.mockReturnValue( vi.fn() );
		GqlExecutionContext.create = mockGqlContextCreateFn;
	} );

	it( "should return true when authenticated user is part of specified roles", async () => {
		mockReflector.get.mockReturnValue( [ "MEMBER_WEBOPS" ] );

		const rolesGuard = new RolesGuard( mockReflector );
		const isAuthorized = await rolesGuard.canActivate( mockExecutionContext );

		expect( isAuthorized ).toBeTruthy();
		expect( mockReflector.get ).toHaveBeenCalled();
		expect( mockGqlContextCreateFn ).toHaveBeenCalledWith( mockExecutionContext );
		expect( mockExecutionContext.getHandler ).toHaveBeenCalled();
	} );

	it( "should return false when authenticated user is not part of specified roles", async () => {
		mockReflector.get.mockReturnValue( [ "MEMBER_ENVISAGE" ] );

		const rolesGuard = new RolesGuard( mockReflector );
		const isAuthorized = await rolesGuard.canActivate( mockExecutionContext );

		expect( isAuthorized ).toBeFalsy();
		expect( mockReflector.get ).toHaveBeenCalled();
		expect( mockGqlContextCreateFn ).toHaveBeenCalledWith( mockExecutionContext );
		expect( mockExecutionContext.getHandler ).toHaveBeenCalled();
	} );

	it( "should return false when authInfo not present", async () => {
		mockResponse.locals[ "authInfo" ] = undefined;
		mockServiceContext.res = mockResponse;
		mockGqlExecutionContext.getContext.mockReturnValue( mockServiceContext );
		mockReflector.get.mockReturnValue( [ "MEMBER_ENVISAGE" ] );

		const rolesGuard = new RolesGuard( mockReflector );
		const isAuthorized = await rolesGuard.canActivate( mockExecutionContext );

		expect( isAuthorized ).toBeFalsy();
		expect( mockReflector.get ).toHaveBeenCalled();
		expect( mockGqlContextCreateFn ).toHaveBeenCalledWith( mockExecutionContext );
		expect( mockExecutionContext.getHandler ).toHaveBeenCalled();
	} );

	it( "should return false when roles not present in authInfo", async () => {
		mockResponse.locals[ "authInfo" ] = { id: "some_id" };
		mockServiceContext.res = mockResponse;
		mockGqlExecutionContext.getContext.mockReturnValue( mockServiceContext );
		mockReflector.get.mockReturnValue( [ "MEMBER_ENVISAGE" ] );

		const rolesGuard = new RolesGuard( mockReflector );
		const isAuthorized = await rolesGuard.canActivate( mockExecutionContext );

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