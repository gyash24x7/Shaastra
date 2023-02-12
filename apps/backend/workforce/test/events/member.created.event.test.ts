import type { ClientRedis } from "@nestjs/microservices";
import { Member, Department, MemberPosition } from "@prisma/client/workforce";
import type { PrismaClient } from "@prisma/client/workforce/index.js";
import type { PrismaService } from "@shaastra/framework";
import { describe, it, expect } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { OutboundEvents } from "../../src/constants/outbound.events.js";
import { MemberCreatedEventHandler, MemberCreatedEvent } from "../../src/events/index.js";

describe( "Member Created Event Handler", () => {

	const mockRedisClient = mockDeep<ClientRedis>();
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

	const memberCreatedData = { ...mockMember, password: "some-password" };

	it( "should publish outbound event if core found for that department", async () => {
		mockPrismaService.client.member.findFirst.mockResolvedValue( mockMember );

		const handler = new MemberCreatedEventHandler( mockRedisClient, mockPrismaService );
		await handler.handle( new MemberCreatedEvent( memberCreatedData ) );

		expect( mockPrismaService.client.member.findFirst ).toHaveBeenCalledWith( {
			where: { department: mockMember.department, position: MemberPosition.CORE }
		} );

		expect( mockRedisClient.emit ).toHaveBeenCalledWith( OutboundEvents.MEMBER_CREATED, memberCreatedData );
	} );
} );