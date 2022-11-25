import { AuthGuard as BaseAuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { GqlContext } from "@shaastra/utils";

@Injectable()
export class AuthGuard extends BaseAuthGuard( "jwt" ) {
	getRequest( context: ExecutionContext ) {
		const ctx = GqlExecutionContext.create( context );
		return ctx.getContext<GqlContext>().req;
	}
}