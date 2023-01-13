import type { GraphQLResolveInfo } from 'graphql';
import type { ServiceContext, Maybe, Scalars } from '@shaastra/framework';
import type { PrismaClient, Member, Team, Department, MemberPosition } from '@prisma/client/workforce/index.js';
import type { CreateMemberInput, EnableMemberInput, CreateTeamInput, MutationEnableMemberArgs, MutationCreateMemberArgs, MutationCreateTeamArgs } from '../inputs.js';
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };


export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
      reference: TReference,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Promise<TResult> | TResult;

      type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
      type NullableCheck<T, S> = Maybe<T> extends T ? Maybe<ListCheck<NonNullable<T>, S>> : ListCheck<T, S>;
      type ListCheck<T, S> = T extends (infer U)[] ? NullableCheck<U, S>[] : GraphQLRecursivePick<T, S>;
      export type GraphQLRecursivePick<T, S> = { [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]> };
    

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  CreateMemberInput: ResolverTypeWrapper<CreateMemberInput>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CreateTeamInput: ResolverTypeWrapper<CreateTeamInput>;
  Department: ResolverTypeWrapper<Department>;
  EnableMemberInput: ResolverTypeWrapper<EnableMemberInput>;
  Member: ResolverTypeWrapper<Member>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  MemberPosition: ResolverTypeWrapper<MemberPosition>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Team: ResolverTypeWrapper<Team>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  CreateMemberInput: CreateMemberInput;
  String: Scalars['String'];
  CreateTeamInput: CreateTeamInput;
  EnableMemberInput: EnableMemberInput;
  Member: Member;
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  Mutation: {};
  Query: {};
  Team: Team;
};

export type DepartmentResolvers = EnumResolverSignature<{ CONCEPT_AND_DESIGN?: any, ENVISAGE?: any, EVENTS_AND_WORKSHOPS?: any, EVOLVE?: any, FINANCE?: any, OPERATIONS_AND_INFRASTRUCTURE_PLANNING?: any, PUBLICITY?: any, QMS?: any, SHOWS_AND_EXHIBITIONS?: any, SPONSORSHIP_AND_PR?: any, WEBOPS?: any }, ResolversTypes['Department']>;

export type MemberResolvers<ContextType = ServiceContext<PrismaClient>, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Member']>, { __typename: 'Member' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  about?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coverPic?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['Department'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mobile?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['MemberPosition'], ParentType, ContextType>;
  profilePic?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rollNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  upi?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberPositionResolvers = EnumResolverSignature<{ COCAS?: any, COORD?: any, CORE?: any, HEAD?: any }, ResolversTypes['MemberPosition']>;

export type MutationResolvers<ContextType = ServiceContext<PrismaClient>, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createMember?: Resolver<ResolversTypes['Member'], ParentType, ContextType, RequireFields<MutationCreateMemberArgs, 'data'>>;
  createTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationCreateTeamArgs, 'data'>>;
  enableMember?: Resolver<ResolversTypes['Member'], ParentType, ContextType, RequireFields<MutationEnableMemberArgs, 'data'>>;
};

export type QueryResolvers<ContextType = ServiceContext<PrismaClient>, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
};

export type TeamResolvers<ContextType = ServiceContext<PrismaClient>, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Team']>, { __typename: 'Team' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  createdById?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  department?: Resolver<ResolversTypes['Department'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['Member']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = ServiceContext<PrismaClient>> = {
  Department?: DepartmentResolvers;
  Member?: MemberResolvers<ContextType>;
  MemberPosition?: MemberPositionResolvers;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
};

