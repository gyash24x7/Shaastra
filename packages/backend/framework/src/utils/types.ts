import type { BaseContext, ContextFunction } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import type { JWTPayload } from "jose";
import type { GraphQLResolveInfo } from "graphql/type/index.js";
import type { NextFunction, Request, Response } from "express";

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
	department: string;
	position: string;
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
}

export type AppConfig = AppInfo & {
	auth: {
		audience: string;
		domain: string;
	},
	redis: {
		host: string;
		port: number;
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
	parent: { id?: string };
	args: OperationArgs<A>;
	context: ServiceContext;
	info: GraphQLResolveInfo
}