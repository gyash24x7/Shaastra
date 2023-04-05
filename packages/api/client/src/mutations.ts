import type {
	AddTeamMembersInput,
	CreateMemberInput,
	CreateTeamInput,
	EnableMemberInput,
	LoginInput,
	VerifyUserInput
} from "@api/domain";
import type { Client, MemberGenqlSelection, TeamGenqlSelection, UserGenqlSelection } from "./generated";

export const loginMutationFn = ( client: Client ) => ( data: LoginInput ) => {
	return client.mutation( { login: { __args: { data } } } );
};

export const logoutMutationFn = ( client: Client ) => () => {
	return client.mutation( { logout: true } );
};

export const verifyUserMutationFn = ( client: Client ) => ( data: VerifyUserInput, selection: UserGenqlSelection ) => {
	return client.mutation( { verifyUser: { __args: { data }, ...selection } } );
};

export const createMemberMutationFn = ( client: Client ) => ( data: CreateMemberInput ) => {
	return client.mutation( { createMember: { __args: { data }, id: true } } );
};

export const enableMemberMutationFn = ( client: Client ) => (
	data: EnableMemberInput,
	selection: MemberGenqlSelection
) => {
	return client.mutation( { enableMember: { __args: { data }, ...selection } } );
};

export const createTeamMutationFn = ( client: Client ) => (
	data: CreateTeamInput,
	selection: TeamGenqlSelection
) => {
	return client.mutation( { createTeam: { __args: { data }, ...selection } } );
};

export const addTeamMembersMutationFn = ( client: Client ) => (
	data: AddTeamMembersInput,
	selection: TeamGenqlSelection
) => {
	return client.mutation( { addTeamMembers: { __args: { data }, ...selection } } );
};