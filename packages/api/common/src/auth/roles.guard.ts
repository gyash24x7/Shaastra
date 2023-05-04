import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Department, Position } from "@prisma/client";
import { AuthPayload } from "../auth";
import { LoggerFactory } from "../logger";
import type { ServiceContext } from "../utils";
import { ROLES_KEY } from "./roles.decorator";

export const ALL_DEPARTMENTS = [
	Department.WEBOPS,
	Department.ENVISAGE,
	Department.QMS,
	Department.EVOLVE,
	Department.FINANCE,
	Department.CONCEPT_AND_DESIGN,
	Department.EVENTS_AND_WORKSHOPS,
	Department.OPERATIONS_AND_INFRASTRUCTURE_PLANNING,
	Department.PUBLICITY,
	Department.SHOWS_AND_EXHIBITIONS,
	Department.SPONSORSHIP_AND_PR
] as const;

export const ALL_POSITIONS = [ Position.COORD, Position.HEAD, Position.CORE, Position.COCAS ] as const;

export const ALL_ROLES = ALL_DEPARTMENTS.map( department => `MEMBER_${ department }` )
	.concat( ALL_POSITIONS.map( position => `POSITION_${ position }` ) );

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