import { MemberService, TeamEventsListener } from "@api/domain";
import type { Member, Team } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";

describe( "Team Events Listener", () => {

	const mockMemberService = mockDeep<MemberService>();
	const mockMember = mockDeep<Member>();
	const mockTeam = mockDeep<Team>();

	it( "should send mail to newly added members to the team", async () => {
		mockMember.id = "some_member_id";
		mockMemberService.getMembers.mockResolvedValue( [ mockMember ] );
		const teamEventListener = new TeamEventsListener( mockMemberService );
		await teamEventListener.handleMembersAddedEvent( { ...mockTeam, memberIds: [ mockMember.id ] } );

		expect( mockMemberService.getMembers ).toHaveBeenCalledWith( [ "some_member_id" ] );
	} );
} );