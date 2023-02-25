import type { ClientRedis } from "@nestjs/microservices";
import { Department, Member, MemberPosition } from "@prisma/client/workforce";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { OutboundEvents } from "../../src/constants";
import { MemberEnabledEvent, MemberEnabledEventHandler } from "../../src/events";

describe( "Member Enabled Event Handler", () => {

	const mockRedisClient = mockDeep<ClientRedis>();

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

	it( "should publish outbound event if core found for that department", async () => {
		const handler = new MemberEnabledEventHandler( mockRedisClient );
		await handler.handle( new MemberEnabledEvent( mockMember ) );

		expect( mockRedisClient.emit ).toHaveBeenCalledWith( OutboundEvents.MEMBER_ENABLED, mockMember );
	} );
} );