import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { ServiceContext } from "../utils";
import { Reflector } from "@nestjs/core";
import { Position } from "@prisma/client";
import { POSITION_KEY } from "./position.decorator";
import { LoggerFactory, UserAuthInfo } from "@api/common";

@Injectable()
export class PositionGuard implements CanActivate {
	private readonly logger = LoggerFactory.getLogger( PositionGuard );

	constructor( private readonly reflector: Reflector ) {}

	async canActivate( context: ExecutionContext ) {
		const positions = this.reflector.get<Position[]>( POSITION_KEY, context.getHandler() );
		const gqlContext = GqlExecutionContext.create( context );
		const ctx = gqlContext.getContext<ServiceContext>();
		const authInfo: UserAuthInfo = ctx.res.locals[ "authInfo" ];

		if ( !authInfo || !authInfo.position ) {
			this.logger.warn( "AuthInfo Not Found!" );
			return false;
		}

		return positions.includes( authInfo.position );
	}

}