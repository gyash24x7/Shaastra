import { Team, PrismaClient, Member, Department, MemberPosition } from "@prisma/client/workforce/index.js";
import type { PrismaService } from "@shaastra/framework";
import { describe, it, expect } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { MembersQueryHandler, MembersQuery } from "../../src/queries/index.js";

describe( "Members Query Handler", () => {

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

	const mockTeamWithMembers = { ...mockTeam, members: [ mockMember ] };

	it( "should find members by team id and return them", async () => {
		mockPrismaService.client.team.findUniqueOrThrow.mockResolvedValue( mockTeamWithMembers );

		const handler = new MembersQueryHandler( mockPrismaService );
		const members = await handler.execute( new MembersQuery( mockMember.id ) );

		expect( members ).toEqual( expect.arrayContaining( [ mockMember ] ) );
		expect( mockPrismaService.client.team.findUniqueOrThrow ).toHaveBeenCalledWith( {
			where: { id: mockMember.id },
			include: { members: true }
		} );
	} );
} );