import type { BaseContext, ContextFunction } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import type { Logger } from "pino";
import type { UserAuthInfo, JwtUtils } from "../auth/index.js";
import type { EventBus } from "../events/index.js";

export type ServiceContext<P> = ExpressContextFunctionArgument & {
	prisma: P;
	eventBus: EventBus<P>;
	jwtUtils: JwtUtils;
	authInfo?: UserAuthInfo;
	logger: Logger;
	idCookie?: string;
}

export type ServiceContextFn<P> = ContextFn<ServiceContext<P>>

export type ContextFn<Ctx extends BaseContext> = ContextFunction<[ ExpressContextFunctionArgument ], Ctx>;