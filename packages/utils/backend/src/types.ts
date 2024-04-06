import type { Request, Response } from "express";

export type Department = string

export type Position = string

export type AuthInfo = {
	id: string;
	department: Department;
	position: Position;
}

export type GqlContext = {
	req: Request;
	res: Response;
}

export type AuthContext = GqlContext & {
	authInfo: AuthInfo;
}

export type ServiceContext<T> = AuthContext & {
	service: T
}
