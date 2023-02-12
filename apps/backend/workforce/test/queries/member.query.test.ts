import { PrismaClient, Member, Department, MemberPosition } from "@prisma/client/workforce/index.js";
import type { PrismaService } from "@shaastra/framework";
import { describe, it, expect } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { MemberQuery, MemberQueryHandler } from "../../src/queries/index.js";

describe( "Member Query Handler", () => {

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

	it( "should find member by id and return it", async () => {
		mockPrismaService.client.member.findUnique.mockResolvedValue( mockMember );

		const handler = new MemberQueryHandler( mockPrismaService );
		const member = await handler.execute( new MemberQuery( mockMember.id ) );

		expect( member ).toEqual( mockMember );
		expect( mockPrismaService.client.member.findUnique ).toHaveBeenCalledWith( {
			where: { id: mockMember.id }
		} );
	} );
} );