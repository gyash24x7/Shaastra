import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { ServiceContext } from "../utils";

export const AuthInfo = createParamDecorator(
	( _data: unknown, context: ExecutionContext ) => {
		const gqlContext = GqlExecutionContext.create( context );
		const ctx = gqlContext.getContext<ServiceContext>();
		return ctx.res.locals[ "authInfo" ];
	}
);