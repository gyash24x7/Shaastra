import type { EventBus } from "@nestjs/cqrs";
import { Member, Department, MemberPosition } from "@prisma/client/workforce";
import type { PrismaClient } from "@prisma/client/workforce/index.js";
import type { PrismaService } from "@shaastra/framework";
import { describe, afterEach, it, expect } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { type EnableMemberInput, EnableMemberCommandHandler, EnableMemberCommand } from "../../src/commands/index.js";
import { MemberEnabledEvent } from "../../src/events/index.js";

describe( "Enable Member Command Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();
	const mockEventBus = mockDeep<EventBus>();

	const mockEnableMemberInput: EnableMemberInput = { id: "some-mock-id" };

	const mockMember: Member = {
		department: Department.WEBOPS,
		email: "test@email.com",
		mobile: "1234567890",
		name: "Test Member",
		rollNumber: "AB01C234",
		about: "Mock About",
		coverPic: "MockCoverPicUrl",
		enabled: true,
		id: mockEnableMemberInput.id,
		position: MemberPosition.COORD,
		profilePic: "MockProfilePicUrl",
		upi: "upi@mockbank"
	};

	it( "should enable the member and published the member enabled event", async () => {
		mockPrismaService.client.member.update.mockResolvedValue( mockMember );

		const handler = new EnableMemberCommandHandler( mockPrismaService, mockEventBus );
		const member = await handler.execute( new EnableMemberCommand( mockEnableMemberInput ) );

		expect( mockPrismaService.client.member.update ).toHaveBeenCalledWith( {
			where: { id: mockEnableMemberInput.id },
			data: { enabled: true }
		} );

		expect( mockEventBus.publish ).toHaveBeenCalledWith( new MemberEnabledEvent( member ) );
		expect( member ).toEqual( mockMember );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
		mockClear( mockEventBus );
	} );
} );