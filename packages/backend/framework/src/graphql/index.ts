import type http from "node:http";

export * from "./service.datasource.js";
export * from "./graphql.server.js";

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

export type GraphQLServerOptions = {
	gateway?: boolean;
	httpServer: http.Server;
	resolvers?: any
}