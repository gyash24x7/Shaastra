import type { QueryBus } from "@nestjs/cqrs";
import { Member, Department, MemberPosition, Team } from "@prisma/client/workforce";
import type { GraphQLResolverParams } from "@shaastra/framework";
import { describe, it, afterEach, expect } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { TeamQuery, MembersQuery } from "../../src/queries/index.js";
import { TeamResolvers } from "../../src/resolvers/index.js";

describe( "Team Resolvers", () => {

	const mockQueryBus = mockDeep<QueryBus>();
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
		createdById: "some-member-id",
		department: Department.WEBOPS,
		id: "some-team-id",
		name: "Team Name"
	};

	it( "should resolve reference to team when reference resolver is called", async () => {
		const mockGqlParams = mockDeep<GraphQLResolverParams>();
		mockGqlParams.parent.id = mockTeam.id;
		mockQueryBus.execute.calledWith( expect.any( TeamQuery ) ).mockResolvedValue( mockTeam );

		const teamResolver = new TeamResolvers( mockQueryBus );
		const team = await teamResolver.__resolveReference( mockGqlParams );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( new TeamQuery( mockTeam.id ) );
		expect( team ).toEqual( mockTeam );
	} );

	it( "should return members in the team when members field resolver is called", async () => {
		const mockGqlParams = mockDeep<GraphQLResolverParams>();
		mockGqlParams.parent.id = mockTeam.id;
		mockQueryBus.execute.calledWith( expect.any( MembersQuery ) ).mockResolvedValue( [ mockMember ] );

		const teamResolver = new TeamResolvers( mockQueryBus );
		const members = await teamResolver.members( mockGqlParams );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( new MembersQuery( mockTeam.id ) );
		expect( members ).toEqual( [ mockMember ] );
	} );

	afterEach( () => {
		mockClear( mockQueryBus );
	} );
} );