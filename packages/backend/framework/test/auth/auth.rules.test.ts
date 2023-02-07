import type { GraphQLResolveInfo } from "graphql";
import { test, expect } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import type { ServiceContext } from "../../src/index.js";
import {
	isAuthenticatedRuleFunction,
	isMemberRuleFunction,
	isCoreRuleFunction,
	isCoordRuleFunction,
	isHeadRuleFunction
} from "../../src/index.js";

test( "IsAuthenticatedRuleFunction should check if authenticted", async () => {
	const mockCtx = mockDeep<ServiceContext>();
	const mockGraphQLInfo = mockDeep<GraphQLResolveInfo>();

	mockCtx.res.locals[ "authInfo" ] = {
		id: "1234",
		department: "WEBOPS",
		position: "CORE"
	};
	let isAuthenticated = await isAuthenticatedRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isAuthenticated ).toBeTruthy();

	mockCtx.res.locals[ "authInfo" ] = undefined;
	isAuthenticated = await isAuthenticatedRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isAuthenticated ).toBeFalsy();
} );

test( "IsMemberRuleFunction should check if authenticted user is member", async () => {
	const mockCtx = mockDeep<ServiceContext>();
	const mockGraphQLInfo = mockDeep<GraphQLResolveInfo>();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", department: "WEBOPS", position: "CORE" };
	let isMember = await isMemberRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isMember ).toBeTruthy();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", position: "CORE" };
	isMember = await isMemberRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isMember ).toBeFalsy();

	mockCtx.res.locals[ "authInfo" ] = undefined;
	isMember = await isMemberRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isMember ).toBeFalsy();
} );

test( "IsCoreRuleFunction should check if authenticted user is a core member", async () => {
	const mockCtx = mockDeep<ServiceContext>();
	const mockGraphQLInfo = mockDeep<GraphQLResolveInfo>();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", department: "WEBOPS", position: "CORE" };
	let isCore = await isCoreRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isCore ).toBeTruthy();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", position: "CORE" };
	isCore = await isCoreRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isCore ).toBeFalsy();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", position: "COORD", department: "WEBOPS" };
	isCore = await isCoreRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isCore ).toBeFalsy();

	mockCtx.res.locals[ "authInfo" ] = undefined;
	isCore = await isCoreRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isCore ).toBeFalsy();
} );

test( "IsCoordRuleFunction should check if authenticted user is a coord member", async () => {
	const mockCtx = mockDeep<ServiceContext>();
	const mockGraphQLInfo = mockDeep<GraphQLResolveInfo>();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", department: "WEBOPS", position: "COORD" };
	let isCoord = await isCoordRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isCoord ).toBeTruthy();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", position: "COORD" };
	isCoord = await isCoordRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isCoord ).toBeFalsy();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", position: "HEAD", department: "WEBOPS" };
	isCoord = await isCoordRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isCoord ).toBeFalsy();

	mockCtx.res.locals[ "authInfo" ] = undefined;
	isCoord = await isCoordRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isCoord ).toBeFalsy();
} );

test( "IsHeadRuleFunction should check if authenticted user is a head member", async () => {
	const mockCtx = mockDeep<ServiceContext>();
	const mockGraphQLInfo = mockDeep<GraphQLResolveInfo>();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", department: "WEBOPS", position: "HEAD" };
	let isHead = await isHeadRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isHead ).toBeTruthy();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", position: "HEAD" };
	isHead = await isHeadRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isHead ).toBeFalsy();

	mockCtx.res.locals[ "authInfo" ] = { id: "1234", position: "COORD", department: "WEBOPS" };
	isHead = await isHeadRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isHead ).toBeFalsy();

	mockCtx.res.locals[ "authInfo" ] = undefined;
	isHead = await isHeadRuleFunction( {}, {}, mockCtx, mockGraphQLInfo );
	expect( isHead ).toBeFalsy();
} );