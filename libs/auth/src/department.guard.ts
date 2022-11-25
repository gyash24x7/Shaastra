import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { GqlContext } from "@shaastra/utils";

@Injectable()
export class DepartmentGuard implements CanActivate {
	constructor( private readonly reflector: Reflector ) {}

	canActivate( context: ExecutionContext ) {
		const departments = this.reflector.get<string[]>( "departments", context.getHandler() );
		if ( !departments?.length ) {
			return true;
		}

		const { user } = GqlExecutionContext.create( context ).getContext<GqlContext>().req;
		if ( !user ) {
			throw new UnauthorizedException();
		}

		const authorized = departments.includes( user.department );
		if ( !authorized ) {
			throw new UnauthorizedException();
		}

		return true;
	}
}