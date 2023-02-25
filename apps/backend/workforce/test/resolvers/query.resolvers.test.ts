import type { UserAuthInfo } from "@app/framework/auth";
import type { GraphQLResolverParams } from "@app/framework/graphql";
import type { QueryBus } from "@nestjs/cqrs";
import { Department, Member, MemberPosition } from "@prisma/client/workforce";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { MemberQuery } from "../../src/queries";
import { QueryResolvers } from "../../src/resolvers";

describe( "Query Resolvers", () => {

	const mockQueryBus = mockDeep<QueryBus>();

	const mockAuthInfo: UserAuthInfo = {
		department: Department.WEBOPS,
		id: "mock-user-id",
		position: MemberPosition.COORD
	};

	const mockMember: Member = {
		department: Department.WEBOPS,
		email: "test@email.com",
		mobile: "1234567890",
		name: "Test Member",
		rollNumber: "AB01C234",
		about: "Mock About",
		coverPic: "MockCoverPicUrl",
		enabled: true,
		id: mockAuthInfo.id,
		position: MemberPosition.COORD,
		profilePic: "MockProfilePicUrl",
		upi: "upi@mockbank"
	};

	it( "should return current user when me is called", async () => {
		mockQueryBus.execute.calledWith( expect.any( MemberQuery ) ).mockResolvedValue( mockMember );
		const mockGqlParams = mockDeep<GraphQLResolverParams>();
		mockGqlParams.context.authInfo = mockAuthInfo;

		const resolver = new QueryResolvers( mockQueryBus );
		const me = await resolver.me( mockGqlParams );

		expect( mockQueryBus.execute ).toHaveBeenCalledWith( new MemberQuery( mockAuthInfo.id ) );
		expect( me ).toEqual( mockMember );
	} );

	afterEach( () => {
		mockClear( mockQueryBus );
	} );
} );