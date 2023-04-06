import { MemberResolver, MemberService } from "@api/domain";
import type { Team } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";

describe( "Member Resolver", () => {

	const mockMemberService = mockDeep<MemberService>();
	const mockTeam = mockDeep<Team>();

	it( "should return teams that memeber is part of when teams is called", async () => {
		mockMemberService.getTeamsPartOf.mockResolvedValue( [ mockTeam ] );
		const memberResolver = new MemberResolver( mockMemberService );
		const teamsPartOf = await memberResolver.teams( { id: "some_id" } );

		expect( teamsPartOf.length ).toBe( 1 );
		expect( teamsPartOf[ 0 ] ).toBe( mockTeam );
		expect( mockMemberService.getTeamsPartOf ).toHaveBeenCalledWith( "some_id" );
	} );
} );