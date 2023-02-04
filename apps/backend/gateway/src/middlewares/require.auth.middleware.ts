import type { NestMiddleware } from "@nestjs/common";
import { UnauthorizedException, Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import type { User } from "@prisma/client/identity/index.js";
import { UserAuthInfo, LoggerFactory } from "@shaastra/framework";
import type { Request, Response, NextFunction } from "express";
import { UserQuery } from "../queries/user.query.js";

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