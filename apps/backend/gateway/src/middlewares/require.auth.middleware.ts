import type { UserAuthInfo } from "@app/framework/auth";
import { LoggerFactory } from "@app/framework/logger";
import type { NestMiddleware } from "@nestjs/common";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import type { NextFunction, Request, Response } from "express";
import type { User } from "../../prisma/generated";
import { UserQuery } from "../queries";

@Injectable()
export class RequireAuthMiddleware implements NestMiddleware {
	private readonly logger = LoggerFactory.getLogger( RequireAuthMiddleware );

	constructor( private readonly queryBus: QueryBus ) {}

	async use( _req: Request, res: Response, next: NextFunction ) {
		const authInfo: UserAuthInfo | undefined = res.locals[ "authInfo" ];

		if ( !authInfo?.id ) {
			this.logger.warn( "No AuthInfo Found!" );
			throw new UnauthorizedException();
		}

		const user: User = await this.queryBus.execute( new UserQuery( authInfo.id ) );
		if ( !user ) {
			this.logger.warn( "No User Found!" );
			throw new UnauthorizedException();
		}

		next();
	}

}