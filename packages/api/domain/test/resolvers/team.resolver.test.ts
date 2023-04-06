import { TeamResolver, TeamService } from "@api/domain";
import type { Member } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";

describe( "Team Resolver", () => {

	const mockTeamService = mockDeep<TeamService>();
	const mockMember = mockDeep<Member>();

	it( "should return team creator when createdBy is called", async () => {
		mockTeamService.getTeamCreator.mockResolvedValue( mockMember );
		const teamResolver = new TeamResolver( mockTeamService );
		const creator = await teamResolver.createdBy( { id: "some_id" } );

		expect( creator ).toBe( mockMember );
		expect( mockTeamService.getTeamCreator ).toHaveBeenCalledWith( "some_id" );
	} );

	it( "should return team members when members is called", async () => {
		mockTeamService.getTeamMembers.mockResolvedValue( [ mockMember ] );
		const teamResolver = new TeamResolver( mockTeamService );
		const members = await teamResolver.members( { id: "some_id" } );

		expect( members.length ).toBe( 1 );
		expect( members[ 0 ] ).toBe( mockMember );
		expect( mockTeamService.getTeamMembers ).toHaveBeenCalledWith( "some_id" );
	} );
} );