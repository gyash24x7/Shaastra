import type { UserAuthInfo } from "@api/common";
import { MemberService, QueryResolver, TaskService, TeamService } from "@api/domain";
import type { Member, Task, TaskActivity, Team } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";

describe( "Query Resolver", () => {

	const mockMemberService = mockDeep<MemberService>();
	const mockTeamService = mockDeep<TeamService>();
	const mockTaskService = mockDeep<TaskService>();
	const mockTeam = mockDeep<Team>();
	const mockMember = mockDeep<Member>();
	const mockTask = mockDeep<Task>();
	const mockTaskActivity = mockDeep<TaskActivity>();
	const mockAuthInfo = mockDeep<UserAuthInfo>();

	it( "should return the authenticated member when me is called", async () => {
		mockMemberService.getAuthenticatedMember.mockResolvedValue( mockMember );
		const queryResolver = new QueryResolver( mockMemberService, mockTeamService, mockTaskService );
		const member = await queryResolver.me( mockAuthInfo );

		expect( member ).toBe( mockMember );
		expect( mockMemberService.getAuthenticatedMember ).toHaveBeenCalledWith( mockAuthInfo );
	} );

	it( "should return the teams related to the department when teams is called", async () => {
		mockTeamService.getDepartmentTeams.mockResolvedValue( [ mockTeam ] );
		const queryResolver = new QueryResolver( mockMemberService, mockTeamService, mockTaskService );
		const teams = await queryResolver.teams( "WEBOPS" );

		expect( teams.length ).toBe( 1 );
		expect( teams[ 0 ] ).toBe( mockTeam );
		expect( mockTeamService.getDepartmentTeams ).toHaveBeenCalledWith( "WEBOPS" );
	} );

	it( "should return the tasks related to the member when tasks is called", async () => {
		mockTaskService.getTasks.mockResolvedValue( [ mockTask ] );
		const queryResolver = new QueryResolver( mockMemberService, mockTeamService, mockTaskService );
		const tasks = await queryResolver.tasks( mockAuthInfo );

		expect( tasks.length ).toBe( 1 );
		expect( tasks[ 0 ] ).toBe( mockTask );
		expect( mockTaskService.getTasks ).toHaveBeenCalledWith( mockAuthInfo, false );
	} );

	it( "should return the teams related to the department when teams is called", async () => {
		mockTaskService.getTasks.mockResolvedValue( [ mockTask ] );
		const queryResolver = new QueryResolver( mockMemberService, mockTeamService, mockTaskService );
		const tasks = await queryResolver.tasksRequested( mockAuthInfo );

		expect( tasks.length ).toBe( 1 );
		expect( tasks[ 0 ] ).toBe( mockTask );
		expect( mockTaskService.getTasks ).toHaveBeenCalledWith( mockAuthInfo, true );
	} );

	it( "should return the teams related to the department when teams is called", async () => {
		mockTaskService.getTaskActivity.mockResolvedValue( [ mockTaskActivity ] );
		const queryResolver = new QueryResolver( mockMemberService, mockTeamService, mockTaskService );
		const taskActivity = await queryResolver.taskActivity( "some_task_id" );

		expect( taskActivity.length ).toBe( 1 );
		expect( taskActivity[ 0 ] ).toBe( mockTaskActivity );
		expect( mockTaskService.getTaskActivity ).toHaveBeenCalledWith( "some_task_id" );
	} );
} );