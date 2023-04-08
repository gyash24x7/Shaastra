import type { ServiceContext, UserAuthInfo } from "@api/common";
import {
	AddTeamMembersInput,
	cookieOptions,
	CreateMemberInput,
	CreateTeamInput,
	EnableMemberInput,
	LoginInput,
	MemberService,
	MutationResolver,
	TeamService,
	UserService,
	VerifyUserInput
} from "@api/domain";
import type { Team, User } from "@prisma/client";
import { Department, Member } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";

describe( "MutationResolver", () => {

	const mockMemberService = mockDeep<MemberService>();
	const mockUserService = mockDeep<UserService>();
	const mockTeamService = mockDeep<TeamService>();
	const mockServiceContext = mockDeep<ServiceContext>();
	const mockUser = mockDeep<User>();
	const mockTeam = mockDeep<Team>();
	const mockMember = mockDeep<Member>();
	const mockAuthInfo = mockDeep<UserAuthInfo>();

	it( "should login user, set cookies and return user id when login is called", async () => {
		mockUser.id = "some_id";
		mockUserService.login.mockResolvedValue( { user: mockUser, token: "some_token" } );
		const mutationResolver = new MutationResolver( mockMemberService, mockTeamService, mockUserService );
		const data: LoginInput = { username: "some_username", password: "some_password" };
		const userId = await mutationResolver.login( data, mockServiceContext );

		expect( userId ).toBe( "some_id" );
		expect( mockServiceContext.res.cookie )
			.toHaveBeenCalledWith( "auth-cookie", "some_token", cookieOptions );
		expect( mockUserService.login ).toHaveBeenCalledWith( data );
	} );

	it( "should logout user, set cookies and return user id when logout is called", async () => {
		mockAuthInfo.id = "some_id";
		const mutationResolver = new MutationResolver( mockMemberService, mockTeamService, mockUserService );
		const userId = await mutationResolver.logout( mockServiceContext, mockAuthInfo );

		expect( userId ).toBe( "some_id" );
		expect( mockServiceContext.res.clearCookie ).toHaveBeenCalledWith( "auth-cookie", cookieOptions );
	} );

	it( "should verify user and return it when verifyUser is called", async () => {
		mockUserService.verifyUser.mockResolvedValue( mockUser );
		const mutationResolver = new MutationResolver( mockMemberService, mockTeamService, mockUserService );
		const data: VerifyUserInput = { userId: "some_user_id", hash: "some_token_hash" };
		const userId = await mutationResolver.verifyUser( data );

		expect( userId ).toBe( mockUser );
		expect( mockUserService.verifyUser ).toHaveBeenCalledWith( data );
	} );

	it( "should create member and return it when createMember is called", async () => {
		mockMemberService.createMember.mockResolvedValue( mockMember );
		const mutationResolver = new MutationResolver( mockMemberService, mockTeamService, mockUserService );
		const data: CreateMemberInput = mockDeep<CreateMemberInput>();
		const member = await mutationResolver.createMember( data );

		expect( member ).toBe( mockMember );
		expect( mockMemberService.createMember ).toHaveBeenCalledWith( data );
	} );

	it( "should enable member and return it when enableMember is called", async () => {
		mockMemberService.enableMember.mockResolvedValue( mockMember );
		const mutationResolver = new MutationResolver( mockMemberService, mockTeamService, mockUserService );
		const data: EnableMemberInput = { id: "some_id" };
		const member = await mutationResolver.enableMember( data );

		expect( member ).toBe( mockMember );
		expect( mockMemberService.enableMember ).toHaveBeenCalledWith( data );
	} );

	it( "should create team and return it when createTeam is called", async () => {
		mockTeamService.createTeam.mockResolvedValue( mockTeam );
		const mutationResolver = new MutationResolver( mockMemberService, mockTeamService, mockUserService );
		const data: CreateTeamInput = { name: "some_team_name", department: Department.CONCEPT_AND_DESIGN };
		const team = await mutationResolver.createTeam( data, mockAuthInfo );

		expect( team ).toBe( mockTeam );
		expect( mockTeamService.createTeam ).toHaveBeenCalledWith( data, mockAuthInfo );
	} );

	it( "should add team members and return team when addTeamMembers is called", async () => {
		mockTeamService.addTeamMembers.mockResolvedValue( mockTeam );
		const mutationResolver = new MutationResolver( mockMemberService, mockTeamService, mockUserService );
		const data: AddTeamMembersInput = { teamId: "some_user_id", memberIds: [ "some_member_id" ] };
		const team = await mutationResolver.addTeamMembers( data );

		expect( team ).toBe( mockTeam );
		expect( mockTeamService.addTeamMembers ).toHaveBeenCalledWith( data );
	} );

	afterEach( () => {
		mockClear( mockServiceContext );
		mockClear( mockMemberService );
		mockClear( mockUserService );
		mockClear( mockTeamService );
	} );
} );