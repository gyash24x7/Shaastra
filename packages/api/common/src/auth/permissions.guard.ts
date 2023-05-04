import { AuthPayload, LoggerFactory } from "@api/common";
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AccessControl } from "accesscontrol";
import type { ServiceContext } from "../utils";
import { PERMISSIONS_KEY } from "./permissions.decorator";

const ac = new AccessControl();
ac.grant( "POSITION_COCAS" ).readAny( "" );

@Injectable()
export class PermissionsGuard implements CanActivate {
	private readonly logger = LoggerFactory.getLogger( PermissionsGuard );

	constructor( private readonly reflector: Reflector ) {}

	async canActivate( context: ExecutionContext ) {
		const permissions = this.reflector.get<string[]>( PERMISSIONS_KEY, context.getHandler() );
		const gqlContext = GqlExecutionContext.create( context );
		const ctx = gqlContext.getContext<ServiceContext>();
		const authPayload: AuthPayload = ctx.res.locals[ "authPayload" ];

		if ( !authPayload || !authPayload.permissions ) {
			this.logger.warn( "AuthPayload Not Found!" );
			return false;
		}

		return permissions.some( role => authPayload.permissions.includes( role ) );
	}

}