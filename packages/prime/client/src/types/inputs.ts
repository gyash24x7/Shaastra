import type { ChannelType, Department } from "./enums";

export type CreateMemberInput = {
	name: string;
	email: string;
	rollNumber: string;
	department: Department;
	mobile: string;
	password: string;
}

export type LoginInput = {
	password: string;
	username: string;
}

export type CreateTeamInput = {
	name: string;
	department: Department;
}

export type EnableMemberInput = {
	id: string;
}

export type CreateChannelInput = {
	name: string;
	description: string;
	type: ChannelType;
}

export type CreateMessageInput = {
	content: string;
	channelId: string;
}