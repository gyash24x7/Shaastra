import type { BaseContext, ContextFunction } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import type { CommandBus, EventBus, QueryBus } from "../cqrs/index.js";
import type { Request, Response } from "express";
import type { HealthChecker } from "../health/index.js";
import type { Consul } from "../consul/index.js";
import type { UserAuthInfo } from "../auth/index.js";
import type { AppInfo } from "../application/index.js";

export type ExpressContext = BaseContext & {
	req: Request;
	res: Response;
}

export type CqrsContext = {
	commandBus: CommandBus;
	queryBus: QueryBus;
	eventBus: EventBus;
}

export type ConsulContext = {
	consul: Consul
}

export type AuthContext = {
	authInfo?: UserAuthInfo;
	jwtUtils?: { sign: ( payload: any ) => string }
}

export type AppInfoContext = {
	appInfo: AppInfo;
}

export type HealthContext = {
	healthChecker: HealthChecker
}

export type ServiceContext =
	ExpressContext
	& AppInfoContext
	& ConsulContext
	& HealthContext
	& AuthContext
	& CqrsContext
	& { token?: string, logout?: boolean, idCookie?: string }

export type ServiceContextFn = ContextFn<ServiceContext>

export type ContextFn<Ctx extends BaseContext> = ContextFunction<[ ExpressContextFunctionArgument ], Ctx>;