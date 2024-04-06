import type { Department } from "@backend/utils";

export type CreateMemberInput = {
	id: string;
	name: string;
	email: string;
	rollNumber: string;
	department: Department;
	mobile: string;
}

export type EnableMemberInput = {
	id: string
}

export type CreateTeamInput = {
	name: string;
	department: Department;
}

export type AddMembersInput = {
	teamId: string;
	memberIds: string[];
}