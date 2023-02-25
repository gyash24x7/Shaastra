import type { ClientRedis } from "@nestjs/microservices";
import type { Member } from "@prisma/client/workforce";
import { Department, MemberPosition, Team } from "@prisma/client/workforce";
import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { OutboundEvents } from "../../src/constants";
import { TeamCreatedEvent, TeamCreatedEventHandler } from "../../src/events";

describe( "Team Created Event Handler", () => {

	const mockRedisClient = mockDeep<ClientRedis>();

	const mockMember: Member = {
		department: Department.WEBOPS,
		email: "test@email.com",
		mobile: "1234567890",
		name: "Test Team",
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

	const teamCreatedData = { ...mockTeam, members: [ mockMember ] };

	it( "should publish outbound event if core found for that department", async () => {
		const handler = new TeamCreatedEventHandler( mockRedisClient );
		await handler.handle( new TeamCreatedEvent( teamCreatedData ) );

		expect( mockRedisClient.emit ).toHaveBeenCalledWith( OutboundEvents.TEAM_CREATED, teamCreatedData );
	} );
} );