import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { ServiceContext } from "../utils";
import { Reflector } from "@nestjs/core";
import { Department } from "@prisma/client";
import { DEPARTMENT_KEY } from "./department.decorator";
import { LoggerFactory, UserAuthInfo } from "@api/common";

@Injectable()
export class DepartmentGuard implements CanActivate {
	private readonly logger = LoggerFactory.getLogger( DepartmentGuard );

	constructor( private readonly reflector: Reflector ) {}

	async canActivate( context: ExecutionContext ) {
		const departments = this.reflector.get<Department[]>( DEPARTMENT_KEY, context.getHandler() );
		const gqlContext = GqlExecutionContext.create( context );
		const ctx = gqlContext.getContext<ServiceContext>();
		const authInfo: UserAuthInfo = ctx.res.locals[ "authInfo" ];

		if ( !authInfo || !authInfo.department ) {
			this.logger.warn( "AuthInfo Not Found!" );
			return false;
		}

		return departments.includes( authInfo.department );
	}

}