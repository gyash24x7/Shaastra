export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Channel = {
  readonly archived: Scalars['Boolean'];
  readonly createdById: Scalars['String'];
  readonly createdOn: Scalars['String'];
  readonly description: Scalars['String'];
  readonly id: Scalars['ID'];
  readonly messages: ReadonlyArray<Message>;
  readonly name: Scalars['String'];
  readonly type: ChannelType;
};

export const enum ChannelType {
  Direct = 'DIRECT',
  Group = 'GROUP'
};

export type CreateChannelInput = {
  readonly description: Scalars['String'];
  readonly name: Scalars['String'];
  readonly type: ChannelType;
};

export type CreateMemberInput = {
  readonly department: Department;
  readonly email: Scalars['String'];
  readonly mobile: Scalars['String'];
  readonly name: Scalars['String'];
  readonly password: Scalars['String'];
  readonly rollNumber: Scalars['String'];
};

export type CreateMessageInput = {
  readonly channelId: Scalars['String'];
  readonly content: Scalars['String'];
};

export type CreateTeamInput = {
  readonly department: Department;
  readonly name: Scalars['String'];
};

export const enum Department {
  ConceptAndDesign = 'CONCEPT_AND_DESIGN',
  Envisage = 'ENVISAGE',
  EventsAndWorkshops = 'EVENTS_AND_WORKSHOPS',
  Evolve = 'EVOLVE',
  Finance = 'FINANCE',
  OperationsAndInfrastructurePlanning = 'OPERATIONS_AND_INFRASTRUCTURE_PLANNING',
  Publicity = 'PUBLICITY',
  Qms = 'QMS',
  ShowsAndExhibitions = 'SHOWS_AND_EXHIBITIONS',
  SponsorshipAndPr = 'SPONSORSHIP_AND_PR',
  Webops = 'WEBOPS'
};

export type EnableMemberInput = {
  readonly id: Scalars['String'];
};

export type Member = {
  readonly about: Scalars['String'];
  readonly coverPic: Scalars['String'];
  readonly department: Department;
  readonly email: Scalars['String'];
  readonly enabled: Scalars['Boolean'];
  readonly id: Scalars['ID'];
  readonly mobile: Scalars['String'];
  readonly name: Scalars['String'];
  readonly position: MemberPosition;
  readonly profilePic: Scalars['String'];
  readonly rollNumber: Scalars['String'];
  readonly teams: ReadonlyArray<Team>;
  readonly upi: Scalars['String'];
};

export const enum MemberPosition {
  Cocas = 'COCAS',
  Coord = 'COORD',
  Core = 'CORE',
  Head = 'HEAD'
};

export type Message = {
  readonly channel: Channel;
  readonly channelId: Scalars['String'];
  readonly content: Scalars['String'];
  readonly createdById: Scalars['String'];
  readonly id: Scalars['ID'];
};

export type MessagesInput = {
  readonly channelId: Scalars['String'];
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
  readonly createdById: Scalars['String'];
  readonly department: Department;
  readonly id: Scalars['ID'];
  readonly members: ReadonlyArray<Member>;
  readonly name: Scalars['String'];
};
