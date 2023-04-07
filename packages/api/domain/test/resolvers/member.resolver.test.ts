import { MemberResolver, MemberService } from "@api/domain";
import type { Task, Team } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";

describe( "Member Resolver", () => {

	const mockMemberService = mockDeep<MemberService>();
	const mockTeam = mockDeep<Team>();
	const mockTask = mockDeep<Task>();

	it( "should return teams that member is part of when teams is called", async () => {
		mockMemberService.getTeamsPartOf.mockResolvedValue( [ mockTeam ] );
		const memberResolver = new MemberResolver( mockMemberService );
		const teamsPartOf = await memberResolver.teams( { id: "some_id" } );

		expect( teamsPartOf.length ).toBe( 1 );
		expect( teamsPartOf[ 0 ] ).toBe( mockTeam );
		expect( mockMemberService.getTeamsPartOf ).toHaveBeenCalledWith( "some_id" );
	} );

	it( "should return tasks created by that member when getTasksCreated is called", async () => {
		mockMemberService.getTasksCreated.mockResolvedValue( [ mockTask ] );
		const memberResolver = new MemberResolver( mockMemberService );
		const tasksCreated = await memberResolver.tasksCreated( { id: "some_id" } );

		expect( tasksCreated.length ).toBe( 1 );
		expect( tasksCreated[ 0 ] ).toBe( mockTask );
		expect( mockMemberService.getTasksCreated ).toHaveBeenCalledWith( "some_id" );
	} );

	it( "should return tasks assigned to that member when getTasksAssigned is called", async () => {
		mockMemberService.getTasksAssigned.mockResolvedValue( [ mockTask ] );
		const memberResolver = new MemberResolver( mockMemberService );
		const tasksAssigned = await memberResolver.tasksAssigned( { id: "some_id" } );

		expect( tasksAssigned.length ).toBe( 1 );
		expect( tasksAssigned[ 0 ] ).toBe( mockTask );
		expect( mockMemberService.getTasksAssigned ).toHaveBeenCalledWith( "some_id" );
	} );

	afterEach( () => {
		mockClear( mockMemberService );
	} );
} );