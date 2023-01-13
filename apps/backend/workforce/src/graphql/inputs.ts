import type { Department, MemberPosition } from "@prisma/client/workforce/index.js";
import type { OperationArgs } from "@shaastra/framework";

export type CreateMemberInput = {
	name: string;
	email: string;
	password: string;
	rollNumber: string;
	department: Department;
	position: MemberPosition;
	mobile: string;
	userId: string;
}

export type MutationCreateMemberArgs = OperationArgs<CreateMemberInput>
export type MutationCreateTeamArgs = OperationArgs<CreateTeamInput>
export type MutationEnableMemberArgs = OperationArgs<EnableMemberInput>

export type CreateTeamInput = {
	name: string;
	department: Department;
}

export type EnableMemberInput = {
	id: string
}