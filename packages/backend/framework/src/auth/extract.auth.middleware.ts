import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import type { AppConfig } from "../config/index.js";
import { Config } from "../config/index.js";
import { JwtService } from "./jwt.service.js";

@Injectable()
export class ExtractAuthMiddleware implements NestMiddleware {

	constructor(
		private readonly jwtService: JwtService,
		@Config() private readonly config: AppConfig
	) {}

	async use( req: Request, res: Response, next: NextFunction ) {
		const isGateway = this.config.appInfo.id === "gateway";

		const token = isGateway
			? req.cookies[ "identity" ]
			: this.jwtService.extractTokenFromRequestHeaders( req );

		if ( token ) {
			const authInfo = await this.jwtService.verify( token );

			if ( authInfo ) {
				res.locals[ "authInfo" ] = authInfo;
			}
		}

		next();
	}
}