import type { Department, MemberPosition, ChannelType } from "./enums.js";

export type Channel = {
	id: string;
	name: string;
	description: string;
	createdOn: Date;
	archived: boolean;
	type: ChannelType;
	createdById: string;
	messages: Message[];
}

export type Message = {
	id: string;
	content: string;
	createdById: string;
	channelId: string;
	createdOn: Date;
	channel: Channel;
}

export type User = {
	id: string;
	name: string;
	email: string;
	username: string;
	verified: boolean;
	roles: string[];
}

export type Member = {
	id: string;
	name: string;
	email: string;
	rollNumber: string;
	profilePic: string;
	coverPic: string;
	mobile: string;
	upi: string;
	about: string;
	department: Department;
	position: MemberPosition;
	enabled: boolean;
	teams: Team[];
}

export type Team = {
	id: string;
	name: string;
	department: Department;
	createdById: string;
	createdBy: Member;
	members: Member[];
}
