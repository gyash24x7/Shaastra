import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { ServiceContext } from "../utils";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";
import { AuthPayload, LoggerFactory } from "@api/common";

@Injectable()
export class RolesGuard implements CanActivate {
	private readonly logger = LoggerFactory.getLogger( RolesGuard );

	constructor( private readonly reflector: Reflector ) {}

	async canActivate( context: ExecutionContext ) {
		const roles = this.reflector.get<string[]>( ROLES_KEY, context.getHandler() );
		const gqlContext = GqlExecutionContext.create( context );
		const ctx = gqlContext.getContext<ServiceContext>();
		const authPayload: AuthPayload = ctx.res.locals[ "authPayload" ];

		if ( !authPayload || !authPayload.roles ) {
			this.logger.warn( "AuthPayload Not Found!" );
			return false;
		}

		return roles.some( role => authPayload.roles.includes( role ) );
	}

}