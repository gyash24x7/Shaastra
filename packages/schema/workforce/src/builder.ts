import type { AuthContext } from "@backend/utils";
import SchemaBuilder from "@pothos/core";
import DirectivesPlugin from "@pothos/plugin-directives";
import FederationPlugin from "@pothos/plugin-federation";
import PrismaPlugin from "@pothos/plugin-prisma";
import {
	type AddMembersInput,
	type CreateMemberInput,
	type CreateTeamInput,
	type EnableMemberInput,
	prisma,
	type PrismaTypes
} from "@workforce/core";

export const builder = new SchemaBuilder<{
	Context: AuthContext,
	PrismaTypes: PrismaTypes,
	Inputs: {
		CreateMemberInput: CreateMemberInput,
		EnableMemberInput: EnableMemberInput,
		CreateTeamInput: CreateTeamInput,
		AddMembersInput: AddMembersInput
	}
}>( {
	plugins: [ PrismaPlugin, DirectivesPlugin, FederationPlugin ],
	prisma: {
		client: prisma
	}
} );

export class ObjectTypes {
	public static readonly Member = "Member";
	public static readonly Team = "Team";
}

export class Inputs {
	public static readonly CreateMemberInput = "CreateMemberInput";
	public static readonly EnableMemberInput = "EnableMemberInput";
	public static readonly CreateTeamInput = "CreateTeamInput";
	public static readonly AddMembersInput = "AddMembersInput";
}

export class Queries {
	public static readonly MemberInfo = "memberInfo";
}

export class Mutations {
	public static readonly CreateMember = "createMember";
	public static readonly EnableMember = "enableMember";
	public static readonly CreateTeam = "createTeam";
	public static readonly AddMembers = "addMembers";
}
