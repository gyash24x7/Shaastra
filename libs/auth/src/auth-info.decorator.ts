import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { GqlContext } from "@shaastra/utils";

export const AuthInfo = createParamDecorator(
	( _data: unknown, context: ExecutionContext ) => {
		const ctx = GqlExecutionContext.create( context );
		return ctx.getContext<GqlContext>().req.user;
	}
);