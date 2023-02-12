import { Team, PrismaClient, Member, Department, MemberPosition } from "@prisma/client/workforce/index.js";
import type { PrismaService } from "@shaastra/framework";
import { describe, it, expect } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { TeamsQueryHandler, TeamsQuery } from "../../src/queries/index.js";

describe( "Teams Query Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();
	const mockMember: Member = {
		department: Department.WEBOPS,
		email: "test@email.com",
		mobile: "1234567890",
		name: "Test Member",
		rollNumber: "AB01C234",
		about: "Mock About",
		coverPic: "MockCoverPicUrl",
		enabled: true,
		id: "some-mock-id",
		position: MemberPosition.COORD,
		profilePic: "MockProfilePicUrl",
		upi: "upi@mockbank"
	};

	const mockTeam: Team = {
		createdById: mockMember.id,
		department: mockMember.department,
		id: "some-team-id",
		name: "Team Name"
	};

	const mockMemberWithTeams = { ...mockMember, teams: [ mockTeam ] };

	it( "should find teams by team id and return them", async () => {
		mockPrismaService.client.member.findUniqueOrThrow.mockResolvedValue( mockMemberWithTeams );

		const handler = new TeamsQueryHandler( mockPrismaService );
		const teams = await handler.execute( new TeamsQuery( mockMember.id ) );

		expect( teams ).toEqual( expect.arrayContaining( [ mockTeam ] ) );
		expect( mockPrismaService.client.member.findUniqueOrThrow ).toHaveBeenCalledWith( {
			where: { id: mockMember.id },
			include: { teams: true }
		} );
	} );
} );