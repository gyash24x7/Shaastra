import type { BaseContext, ContextFunction } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import type { Type } from "@nestjs/common";
import type { GraphQLResolveInfo } from "graphql";
import type { IRule } from "graphql-shield";
import type { UserAuthInfo } from "../auth/index.js";

export type ServiceContext = ExpressContextFunctionArgument & { authInfo?: UserAuthInfo; }

export type ContextFn<Ctx extends BaseContext> = ContextFunction<[ ExpressContextFunctionArgument ], Ctx>;

export type ServiceContextFn = ContextFn<ServiceContext>

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [ key: string ]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	Date: any;
};

export type OperationArgs<I> = { data: I };

export type GraphQLResolverParams<A = {}> = {
	parent: { id?: string } & { [ key: string ]: any };
	args: OperationArgs<A>;
	context: ServiceContext;
	info: GraphQLResolveInfo
}

export type Resolvers = {
	[ key: string ]: ( parent: any, args: any, context: ServiceContext, info: GraphQLResolveInfo ) => any
};

export type Permissions = {
	[ key: string ]: IRule
};

export type ResolverMap = {
	[ key: string ]: Resolvers;
}

export type PermissionsMap = {
	[ key: string ]: Permissions;
}

export type ResolverFn = ( param: GraphQLResolverParams ) => any;

export type OperationType = "Query" | "Mutation" | "ResolveReference" | "FieldResolver"

export interface DiscoveredProvider<T = object> {
	name: string;
	instance?: T;
	injectType?: Function | Type;
	dependencyType: Type<T>;
}

export interface DiscoveredResolver<T = object> extends DiscoveredProvider<T> {
	resolverType: string;
	instance: T;
}

export interface DiscoveredOperation {
	handler: ( ...args: any[] ) => any;
	name: string;
	operationType: OperationType;
}