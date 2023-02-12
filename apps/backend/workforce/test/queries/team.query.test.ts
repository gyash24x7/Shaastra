import { Team, PrismaClient, Department } from "@prisma/client/workforce/index.js";
import type { PrismaService } from "@shaastra/framework";
import { describe, it, expect } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { TeamQuery, TeamQueryHandler } from "../../src/queries/index.js";

describe( "Team Query Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();
	const mockTeam: Team = {
		createdById: "some-member-id",
		department: Department.WEBOPS,
		id: "some-team-id",
		name: "Team Name"
	};

	it( "should find team by id and return it", async () => {
		mockPrismaService.client.team.findUnique.mockResolvedValue( mockTeam );

		const handler = new TeamQueryHandler( mockPrismaService );
		const team = await handler.execute( new TeamQuery( mockTeam.id ) );

		expect( team ).toEqual( mockTeam );
		expect( mockPrismaService.client.team.findUnique ).toHaveBeenCalledWith( {
			where: { id: mockTeam.id }
		} );
	} );
} );