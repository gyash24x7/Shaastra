import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { LoggerFactory } from "../logger";
import type { ServiceContext } from "../utils";
import { JwtService } from "./jwt.service";

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger = LoggerFactory.getLogger( AuthGuard );

	constructor( private readonly jwtService: JwtService ) {}

	async canActivate( context: ExecutionContext ) {
		const gqlContext = GqlExecutionContext.create( context );
		const ctx = gqlContext.getContext<ServiceContext>();
		this.logger.debug( "Cookies: %o", ctx.req.cookies );
		const authCookie: string = ctx.req.cookies[ "auth-cookie" ];
		this.logger.debug( "Auth Cookie: %s", authCookie );
		const authInfo = await this.jwtService.verify( authCookie );
		ctx.res.locals[ "authInfo" ] = authInfo;

		return !!authInfo;
	}

}