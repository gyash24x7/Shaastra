import type { UserAuthInfo } from "@api/common";
import { MemberService, QueryResolver, TaskActivityService, TaskService, TeamService } from "@api/domain";
import type { Member, Team } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";

describe( "Query Resolver", () => {

	const mockMemberService = mockDeep<MemberService>();
	const mockTeamService = mockDeep<TeamService>();
	const mockTaskService = mockDeep<TaskService>();
	const mockTaskActivityService = mockDeep<TaskActivityService>();
	const mockTeam = mockDeep<Team>();
	const mockMember = mockDeep<Member>();
	const mockAuthInfo = mockDeep<UserAuthInfo>();

	it( "should return the authenticated member when me is called", async () => {
		mockMemberService.getAuthenticatedMember.mockResolvedValue( mockMember );
		const queryResolver = new QueryResolver(
			mockMemberService,
			mockTeamService,
			mockTaskService,
			mockTaskActivityService
		);
		const member = await queryResolver.me( mockAuthInfo );

		expect( member ).toBe( mockMember );
		expect( mockMemberService.getAuthenticatedMember ).toHaveBeenCalledWith( mockAuthInfo );
	} );

	it( "should return the teams related to the department when teams is called", async () => {
		mockTeamService.getDepartmentTeams.mockResolvedValue( [ mockTeam ] );
		const queryResolver = new QueryResolver(
			mockMemberService,
			mockTeamService,
			mockTaskService,
			mockTaskActivityService
		);
		const teams = await queryResolver.teams( "WEBOPS" );

		expect( teams.length ).toBe( 1 );
		expect( teams[ 0 ] ).toBe( mockTeam );
		expect( mockTeamService.getDepartmentTeams ).toHaveBeenCalledWith( "WEBOPS" );
	} );
} );