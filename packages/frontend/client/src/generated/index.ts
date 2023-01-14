import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [ key: string ]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>( query: string, variables?: TVariables ) {
	return async (): Promise<TData> => {
		const res = await fetch( "http://localhost:9000/api/graphql", {
			method: "POST",
			...(
				{ "credentials": "include" }
			),
			body: JSON.stringify( { query, variables } )
		} );

		const json = await res.json();

		if ( json.errors ) {
			const { message } = json.errors[ 0 ];

			throw new Error( message );
		}

		return json.data;
	};
}

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
};

export type Channel = {
	readonly archived: Scalars["Boolean"];
	readonly createdById: Scalars["String"];
	readonly createdOn: Scalars["String"];
	readonly description: Scalars["String"];
	readonly id: Scalars["ID"];
	readonly messages: ReadonlyArray<Message>;
	readonly name: Scalars["String"];
	readonly type: ChannelType;
};

export const enum ChannelType {
	Direct = "DIRECT",
	Group = "GROUP"
};

export type CreateChannelInput = {
	readonly description: Scalars["String"];
	readonly name: Scalars["String"];
	readonly type: ChannelType;
};

export type CreateMemberInput = {
	readonly department: Department;
	readonly email: Scalars["String"];
	readonly mobile: Scalars["String"];
	readonly name: Scalars["String"];
	readonly rollNumber: Scalars["String"];
	readonly userId: Scalars["String"];
};

export type CreateMessageInput = {
	readonly channelId: Scalars["String"];
	readonly content: Scalars["String"];
};

export type CreateTeamInput = {
	readonly department: Department;
	readonly name: Scalars["String"];
};

export const enum Department {
	ConceptAndDesign = "CONCEPT_AND_DESIGN",
	Envisage = "ENVISAGE",
	EventsAndWorkshops = "EVENTS_AND_WORKSHOPS",
	Evolve = "EVOLVE",
	Finance = "FINANCE",
	OperationsAndInfrastructurePlanning = "OPERATIONS_AND_INFRASTRUCTURE_PLANNING",
	Publicity = "PUBLICITY",
	Qms = "QMS",
	ShowsAndExhibitions = "SHOWS_AND_EXHIBITIONS",
	SponsorshipAndPr = "SPONSORSHIP_AND_PR",
	Webops = "WEBOPS"
};

export type EnableMemberInput = {
	readonly id: Scalars["String"];
};

export type Member = {
	readonly about: Scalars["String"];
	readonly coverPic: Scalars["String"];
	readonly department: Department;
	readonly email: Scalars["String"];
	readonly enabled: Scalars["Boolean"];
	readonly id: Scalars["ID"];
	readonly mobile: Scalars["String"];
	readonly name: Scalars["String"];
	readonly position: MemberPosition;
	readonly profilePic: Scalars["String"];
	readonly rollNumber: Scalars["String"];
	readonly teams: ReadonlyArray<Team>;
	readonly upi: Scalars["String"];
};

export const enum MemberPosition {
	Cocas = "COCAS",
	Coord = "COORD",
	Core = "CORE",
	Head = "HEAD"
};

export type Message = {
	readonly channel: Channel;
	readonly channelId: Scalars["String"];
	readonly content: Scalars["String"];
	readonly createdById: Scalars["String"];
	readonly id: Scalars["ID"];
};

export type MessagesInput = {
	readonly channelId: Scalars["String"];
};

export type Mutation = {
	readonly createChannel: Channel;
	readonly createMember: Member;
	readonly createMessage: Message;
	readonly createTeam: Team;
	readonly enableMember: Member;
};

export type MutationCreateChannelArgs = {
	data: CreateChannelInput;
};

export type MutationCreateMemberArgs = {
	data: CreateMemberInput;
};

export type MutationCreateMessageArgs = {
	data: CreateMessageInput;
};

export type MutationCreateTeamArgs = {
	data: CreateTeamInput;
};

export type MutationEnableMemberArgs = {
	data: EnableMemberInput;
};

export type Query = {
	readonly channels: ReadonlyArray<Channel>;
	readonly me: Member;
	readonly messages: ReadonlyArray<Message>;
};

export type QueryMessagesArgs = {
	data: MessagesInput;
};

export type Team = {
	readonly createdById: Scalars["String"];
	readonly department: Department;
	readonly id: Scalars["ID"];
	readonly members: ReadonlyArray<Member>;
	readonly name: Scalars["String"];
};

export type CreateMemberMutationVariables = Exact<{
	name: Scalars["String"];
	email: Scalars["String"];
	mobile: Scalars["String"];
	department: Department;
	rollNumber: Scalars["String"];
	userId: Scalars["String"];
}>;

export type CreateMemberMutation = { readonly createMember: { readonly id: string, readonly name: string, readonly email: string, readonly rollNumber: string, readonly profilePic: string, readonly position: MemberPosition, readonly department: Department, readonly about: string } };

export type MeQueryVariables = Exact<{ [ key: string ]: never; }>;

export type MeQuery = { readonly me: { readonly id: string, readonly name: string, readonly email: string, readonly rollNumber: string, readonly position: MemberPosition, readonly profilePic: string, readonly coverPic: string, readonly department: Department, readonly enabled: boolean } };

export const CreateMemberDocument = `
    mutation createMember($name: String!, $email: String!, $mobile: String!, $department: Department!, $rollNumber: String!, $userId: String!) {
  createMember(
    data: {name: $name, email: $email, mobile: $mobile, rollNumber: $rollNumber, department: $department, userId: $userId}
  ) {
    id
    name
    email
    rollNumber
    profilePic
    position
    department
    about
  }
}
    `;
export const useCreateMemberMutation = <
	TError = unknown,
	TContext = unknown
>( options?: UseMutationOptions<CreateMemberMutation, TError, CreateMemberMutationVariables, TContext> ) =>
	useMutation<CreateMemberMutation, TError, CreateMemberMutationVariables, TContext>(
		[ "createMember" ],
		( variables?: CreateMemberMutationVariables ) => fetcher<CreateMemberMutation, CreateMemberMutationVariables>(
			CreateMemberDocument,
			variables
		)(),
		options
	);
export const MeDocument = `
    query me {
  me {
    id
    name
    email
    rollNumber
    position
    profilePic
    coverPic
    department
    enabled
  }
}
    `;
export const useMeQuery = <
	TData = MeQuery,
	TError = unknown
>(
	variables?: MeQueryVariables,
	options?: UseQueryOptions<MeQuery, TError, TData>
) =>
	useQuery<MeQuery, TError, TData>(
		variables === undefined ? [ "me" ] : [ "me", variables ],
		fetcher<MeQuery, MeQueryVariables>( MeDocument, variables ),
		options
	);