import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { UserAuthInfo } from "./auth.payload.js";

@Injectable()
export class PositionGuard implements CanActivate {
	constructor( private readonly reflector: Reflector ) {}

	canActivate( context: ExecutionContext ) {
		const positions = this.reflector.get<string[]>( "positions", context.getHandler() );
		if ( !positions?.length ) {
			return true;
		}

		const request = GqlExecutionContext.create( context ).getContext().req;
		const user: UserAuthInfo | undefined = request.user;
		if ( !user ) {
			throw new UnauthorizedException();
		}

		const authorized = positions.includes( user.position );
		if ( !authorized ) {
			throw new UnauthorizedException();
		}

		return true;
	}
}