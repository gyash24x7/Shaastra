import type { BaseContext, ContextFunction } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import type { Type } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import type { GraphQLResolveInfo } from "graphql";
import type { IRule } from "graphql-shield";
import type { JWTPayload } from "jose";

export type ExpressMiddleware = ( req: Request, res: Response, next: NextFunction ) => unknown | Promise<unknown>

export type ExpressErrorHandler = (
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) => unknown | Promise<unknown>

export type ServiceContext = ExpressContextFunctionArgument & { authInfo?: UserAuthInfo; }

export type ContextFn<Ctx extends BaseContext> = ContextFunction<[ ExpressContextFunctionArgument ], Ctx>;

export type ServiceContextFn = ContextFn<ServiceContext>

export interface UserAuthInfo {
	id: string;
	department?: string;
	position?: string;
}

export interface JWTPayloadExtension {
	id: string,
	roles: string[],
	verified: boolean
}

export type AuthPayload = JWTPayloadExtension & JWTPayload;

export type AppInfo = {
	id: string;
	name: string;
	url: string;
	pkg: string;
	port: number;
	address: string;
	isGateway: boolean;
}

export type AppConfig = {
	appInfo: AppInfo,
	auth: {
		audience: string;
		domain: string;
		privateKeyPath: string;
		publicKeyPath: string;
	},
	redis: {
		host: string;
		port: number;
	},
	graphql: {
		schemaPath?: string;
	}
}

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
