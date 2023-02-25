import type { PrismaService } from "@app/framework/prisma";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { Department, Member, MemberPosition, PrismaClient } from "../../prisma/generated";
import { MemberQuery, MemberQueryHandler } from "../../src/queries";

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