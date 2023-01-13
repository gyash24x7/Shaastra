import type { GraphQLResolveInfo } from 'graphql';
import type { ServiceContext, Maybe, Scalars } from '@shaastra/framework';
import type { PrismaClient, Channel, Message, ChannelType } from '@prisma/client/connect/index.js';
import type { CreateChannelInput, CreateMessageInput, MessagesInput, MutationCreateChannelArgs, MutationCreateMessageArgs, QueryMessagesArgs } from '../inputs.js';
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
  Channel: ResolverTypeWrapper<Channel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  ChannelType: ResolverTypeWrapper<ChannelType>;
  CreateChannelInput: ResolverTypeWrapper<CreateChannelInput>;
  CreateMessageInput: ResolverTypeWrapper<CreateMessageInput>;
  Message: ResolverTypeWrapper<Message>;
  MessagesInput: ResolverTypeWrapper<MessagesInput>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Channel: Channel;
  Boolean: Scalars['Boolean'];
  String: Scalars['String'];
  ID: Scalars['ID'];
  CreateChannelInput: CreateChannelInput;
  CreateMessageInput: CreateMessageInput;
  Message: Message;
  MessagesInput: MessagesInput;
  Mutation: {};
  Query: {};
};

export type ChannelResolvers<ContextType = ServiceContext<PrismaClient>, ParentType extends ResolversParentTypes['Channel'] = ResolversParentTypes['Channel']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Channel']>, { __typename: 'Channel' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  archived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdById?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  messages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ChannelType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChannelTypeResolvers = EnumResolverSignature<{ DIRECT?: any, GROUP?: any }, ResolversTypes['ChannelType']>;

export type MessageResolvers<ContextType = ServiceContext<PrismaClient>, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Message']>, { __typename: 'Message' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  channel?: Resolver<ResolversTypes['Channel'], ParentType, ContextType>;
  channelId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdById?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = ServiceContext<PrismaClient>, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createChannel?: Resolver<ResolversTypes['Channel'], ParentType, ContextType, RequireFields<MutationCreateChannelArgs, 'data'>>;
  createMessage?: Resolver<ResolversTypes['Message'], ParentType, ContextType, RequireFields<MutationCreateMessageArgs, 'data'>>;
};

export type QueryResolvers<ContextType = ServiceContext<PrismaClient>, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  channels?: Resolver<Array<ResolversTypes['Channel']>, ParentType, ContextType>;
  messages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryMessagesArgs, 'data'>>;
};

export type Resolvers<ContextType = ServiceContext<PrismaClient>> = {
  Channel?: ChannelResolvers<ContextType>;
  ChannelType?: ChannelTypeResolvers;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

