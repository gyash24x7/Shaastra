import type { CommandBus } from "@nestjs/cqrs";
import { Team, Department, MemberPosition, Member } from "@prisma/client/workforce/index.js";
import type { UserAuthInfo, GraphQLResolverParams } from "@shaastra/framework";
import { describe, it, expect, afterEach } from "vitest";
import { mockDeep, mockClear } from "vitest-mock-extended";
import {
	CreateMemberCommand,
	EnableMemberCommand,
	CreateTeamCommand,
	CreateTeamInput,
	CreateMemberInput,
	EnableMemberInput
} from "../../src/commands/index.js";
import { MutationResolvers } from "../../src/resolvers/index.js";

describe( "Mutation Resolvers", () => {

	const mockCommandBus = mockDeep<CommandBus>();

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

	const mockTeam: Team = {
		createdById: "some-member-id",
		department: Department.WEBOPS,
		id: "some-team-id",
		name: "Team Name"
	};

	const mockCreateTeamInput: CreateTeamInput = { department: Department.WEBOPS, name: "Mock Team" };
	const mockEnableMemberInput: EnableMemberInput = { id: mockAuthInfo.id };
	const mockCreateMemberInput: CreateMemberInput = {
		department: Department.WEBOPS,
		email: "test@email.com",
		mobile: "1234567890",
		name: "Test Member",
		password: "testPassword@1",
		rollNumber: "AB01C234"
	};

	it( "should publish create team command when createTeam is called", async () => {
		mockCommandBus.execute.calledWith( expect.any( CreateTeamCommand ) ).mockResolvedValue( mockTeam );
		const mockGqlParams = mockDeep<GraphQLResolverParams<CreateTeamInput>>();
		mockGqlParams.context.authInfo = mockAuthInfo;
		mockGqlParams.args.data = mockCreateTeamInput;

		const resolver = new MutationResolvers( mockCommandBus );
		const team = await resolver.createTeam( mockGqlParams );

		expect( team ).toEqual( mockTeam );
		expect( mockCommandBus.execute )
			.toHaveBeenCalledWith( new CreateTeamCommand( mockCreateTeamInput, mockAuthInfo ) );
	} );

	it( "should publish create member command when createMember is called", async () => {
		mockCommandBus.execute.calledWith( expect.any( CreateMemberCommand ) ).mockResolvedValue( mockMember );
		const mockGqlParams = mockDeep<GraphQLResolverParams<CreateMemberInput>>();
		mockGqlParams.context.authInfo = mockAuthInfo;
		mockGqlParams.args.data = mockCreateMemberInput;

		const resolver = new MutationResolvers( mockCommandBus );
		const member = await resolver.createMember( mockGqlParams );

		expect( member ).toEqual( mockMember );
		expect( mockCommandBus.execute ).toHaveBeenCalledWith( new CreateMemberCommand( mockCreateMemberInput ) );
	} );

	it( "should publish enable member command when enableMember is called", async () => {
		mockCommandBus.execute.calledWith( expect.any( EnableMemberCommand ) ).mockResolvedValue( mockMember );
		const mockGqlParams = mockDeep<GraphQLResolverParams<EnableMemberInput>>();
		mockGqlParams.context.authInfo = mockAuthInfo;
		mockGqlParams.args.data = mockEnableMemberInput;

		const resolver = new MutationResolvers( mockCommandBus );
		const member = await resolver.enableMember( mockGqlParams );

		expect( member ).toEqual( mockMember );
		expect( mockCommandBus.execute ).toHaveBeenCalledWith( new EnableMemberCommand( mockEnableMemberInput ) );
	} );

	afterEach( () => {
		mockClear( mockCommandBus );
	} )
} );