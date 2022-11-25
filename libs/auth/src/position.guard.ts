import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { GqlContext } from "@shaastra/utils";

@Injectable()
export class PositionGuard implements CanActivate {
	constructor( private readonly reflector: Reflector ) {}

	canActivate( context: ExecutionContext ) {
		const positions = this.reflector.get<string[]>( "positions", context.getHandler() );
		if ( !positions?.length ) {
			return true;
		}

		const { user } = GqlExecutionContext.create( context ).getContext<GqlContext>().req;
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