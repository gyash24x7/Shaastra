import type { BaseContext, ContextFunction } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import type { CommandBus, EventBus, QueryBus } from "../cqrs/index.js";
import type { Request, Response } from "express";
import type { AppInfo } from "../config/index.js";
import type { HealthChecker } from "../health/index.js";
import type { Consul } from "../consul/index.js";
import type { UserAuthInfo } from "../auth/index.js";
import type { Logger } from "pino";

export type ExpressContext = BaseContext & {
	req: Request;
	res: Response;
}

export type PrismaContext<P> = { prisma: P };

export type CqrsContext<P> = {
	commandBus: CommandBus<P>;
	queryBus: QueryBus<P>;
	eventBus: EventBus<P>;
}

export type LoggerContext = {
	logger: Logger
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
	healthChecker: HealthChecker<ServiceBaseContext>
}

export type ServiceBaseContext =
	ExpressContext
	& AppInfoContext
	& ConsulContext
	& HealthContext
	& LoggerContext;

export type ServiceContextWithPrisma<P> = ServiceBaseContext & PrismaContext<P>

export type ServiceContext<P> =
	ServiceContextWithPrisma<P>
	& AuthContext
	& CqrsContext<P>

export type ServiceContextFn<P> = ContextFn<ServiceContext<P>>

export type GatewayContext =
	ExpressContext
	& AppInfoContext
	& ConsulContext
	& HealthContext
	& LoggerContext
	& { token?: string, logout?: boolean, idCookie?: string }

export type GatewayContextFn = ContextFn<GatewayContext>

export type ContextFn<Ctx extends BaseContext> = ContextFunction<[ ExpressContextFunctionArgument ], Ctx>;