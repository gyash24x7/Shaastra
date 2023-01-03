import type { BaseContext, ContextFunction } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import type { Request, Response } from "express";
import type { UserAuthInfo } from "../auth/index.js";

export type ExpressContext = BaseContext & {
	req: Request;
	res: Response;
}

export type AuthContext = {
	authInfo?: UserAuthInfo;
	jwtUtils?: { sign: ( payload: any ) => string }
}

export type ServiceContext =
	ExpressContext
	& AuthContext
	& { token?: string, logout?: boolean, idCookie?: string }

export type ServiceContextFn = ContextFn<ServiceContext>

export type ContextFn<Ctx extends BaseContext> = ContextFunction<[ ExpressContextFunctionArgument ], Ctx>;