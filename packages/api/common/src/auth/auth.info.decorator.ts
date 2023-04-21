import { createParamDecorator, ExecutionContext, UseGuards } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { ServiceContext } from "../utils";
import type { UserAuthInfo } from "./auth.types";
import { AuthGuard } from "./auth.guard";
import { RolesGuard } from "./roles.guard";

export const authInfoDecoratorFn = ( _data: unknown, context: ExecutionContext ): UserAuthInfo => {
	const gqlContext = GqlExecutionContext.create( context );
	const ctx = gqlContext.getContext<ServiceContext>();
	return ctx.res.locals[ "authInfo" ];
};

export const AuthInfo = createParamDecorator( authInfoDecoratorFn );

export const RequiresAuth = () => UseGuards( AuthGuard, RolesGuard );