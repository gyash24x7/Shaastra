import type { QueryBus } from "@nestjs/cqrs";
import { Member, Department, MemberPosition, Team } from "@prisma/client/workforce";
import type { GraphQLResolverParams } from "@shaastra/framework";
import { describe, it, afterEach, expect } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import { MemberQuery, TeamsQuery } from "../../src/queries/index.js";
import { MemberResolvers } from "../../src/resolvers/index.js";

describe( "Member Resolvers", () => {

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

	it( "should resolve reference to member when reference resolver is called", async () => {
		const mockGqlParams = mockDeep<GraphQLResolverParams>();
		mockGqlParams.parent.id = mockMember.id;
		mockQueryBus.execute.calledWith( expect.any( MemberQuery ) ).mockResolvedValue( mockMember );

		const memberResolver = new MemberResolvers( mockQueryBus );
		const member = await memberResolver.__resolveReference( mockGqlParams );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( new MemberQuery( mockMember.id ) );
		expect( member ).toEqual( mockMember );
	} );

	it( "should return teams for the member when teams field resolver is called", async () => {
		const mockGqlParams = mockDeep<GraphQLResolverParams>();
		mockGqlParams.parent.id = mockMember.id;
		mockQueryBus.execute.calledWith( expect.any( TeamsQuery ) ).mockResolvedValue( [ mockTeam ] );

		const memberResolver = new MemberResolvers( mockQueryBus );
		const teams = await memberResolver.teams( mockGqlParams );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( new TeamsQuery( mockMember.id ) );
		expect( teams ).toEqual( [ mockTeam ] );
	} );

	afterEach( () => {
		mockClear( mockQueryBus );
	} );
} );