import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { ServiceContext } from "../utils";
import { JwtService } from "./jwt.service";

@Injectable()
export class AuthGuard implements CanActivate {

	constructor( private readonly jwtService: JwtService ) {}

	async canActivate( context: ExecutionContext ) {
		const gqlContext = GqlExecutionContext.create( context );
		const ctx = gqlContext.getContext<ServiceContext>();

		const authCookie: string = ctx.req.cookies[ "auth-cookie" ];
		const response = await this.jwtService.verify( authCookie );
		ctx.res.locals[ "authInfo" ] = response?.authInfo;
		ctx.res.locals[ "authPayload" ] = response?.authPayload;

		return !!response;
	}
}