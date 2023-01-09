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
	/** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
	Date: Date;
};

export type Channel = {
	readonly archived: Scalars["Boolean"];
	readonly createdOn: Scalars["Date"];
	readonly description: Scalars["String"];
	readonly id: Scalars["ID"];
	readonly messages: ReadonlyArray<Message>;
	readonly name: Scalars["String"];
	readonly type: ChannelType;
};

export const enum ChannelType {
	Direct = "DIRECT",
	Group = "GROUP"
}

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
	readonly password: Scalars["String"];
	readonly rollNumber: Scalars["String"];
};

export type CreateMessageInput = {
	readonly channelId: Scalars["String"];
	readonly content: Scalars["String"];
};

export type CreateTeamInput = {
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
}

export type EnableMemberInput = {
	readonly id: Scalars["String"];
};

export type LoginInput = {
	readonly password: Scalars["String"];
	readonly username: Scalars["String"];
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
}

export type Message = {
	readonly channel: Channel;
	readonly content: Scalars["String"];
	readonly createdOn: Scalars["Date"];
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
	readonly login: User;
	readonly logout: Scalars["Boolean"];
	readonly verifyUser: User;
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

export type MutationLoginArgs = {
	data: LoginInput;
};

export type MutationVerifyUserArgs = {
	data: VerifyUserInput;
};

export type Query = {
	readonly channels: ReadonlyArray<Channel>;
	readonly me: Maybe<Member>;
	readonly messages: ReadonlyArray<Message>;
};

export type QueryMessagesArgs = {
	data: MessagesInput;
};

export type Team = {
	readonly createdBy: Member;
	readonly department: Department;
	readonly id: Scalars["ID"];
	readonly members: ReadonlyArray<Member>;
	readonly name: Scalars["String"];
};

export type User = {
	readonly email: Scalars["String"];
	readonly id: Scalars["ID"];
	readonly name: Scalars["String"];
	readonly roles: ReadonlyArray<Scalars["String"]>;
	readonly username: Scalars["String"];
	readonly verified: Scalars["Boolean"];
};

export type VerifyUserInput = {
	readonly tokenId: Scalars["String"];
	readonly userId: Scalars["String"];
};

export type LoginMutationVariables = Exact<{
	username: Scalars["String"];
	password: Scalars["String"];
}>;

export type LoginMutation = { readonly login: { readonly id: string, readonly name: string, readonly email: string, readonly roles: ReadonlyArray<string>, readonly verified: boolean } };

export type MeQueryVariables = Exact<{ [ key: string ]: never; }>;

export type MeQuery = { readonly me: { readonly id: string, readonly name: string, readonly email: string, readonly rollNumber: string, readonly position: MemberPosition, readonly profilePic: string, readonly coverPic: string, readonly department: Department, readonly enabled: boolean } | null };

export const LoginDocument = `
    mutation login($username: String!, $password: String!) {
  login(data: {username: $username, password: $password}) {
    id
    name
    email
    roles
    verified
  }
}
    `;
export const useLoginMutation = <
	TError = string,
	TContext = unknown
>( options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext> ) =>
	useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
		[ "login" ],
		( variables?: LoginMutationVariables ) => fetcher<LoginMutation, LoginMutationVariables>(
			LoginDocument,
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
	TError = string
>(
	variables?: MeQueryVariables,
	options?: UseQueryOptions<MeQuery, TError, TData>
) =>
	useQuery<MeQuery, TError, TData>(
		variables === undefined ? [ "me" ] : [ "me", variables ],
		fetcher<MeQuery, MeQueryVariables>( MeDocument, variables ),
		options
	);