import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { JwtService, LoggerFactory } from "@shaastra/framework";
import * as jose from "jose";
import { CommandBus } from "@nestjs/cqrs";
import { LoginCommand, LoginCommandResponse, LoginInput } from "../commands/login.command.js";
import type { CookieOptions, Response } from "express";
import { VerifyUserCommand, VerifyUserInput } from "../commands/verify.user.command.js";
import type { User } from "@prisma/client/identity/index.js";

const accessTokenCookieOptions: CookieOptions = {
	maxAge: 9000000,
	httpOnly: true,
	domain: "localhost",
	path: "/",
	sameSite: "lax",
	secure: false
};

@Controller( "/api/auth" )
export class AuthController {
	private readonly logger = LoggerFactory.getLogger( AuthController );

	constructor(
		private readonly jwtService: JwtService,
		private readonly commandBus: CommandBus
	) {}

	@Get( "keys" )
	async getJWKs() {
		this.logger.debug( ">> getJwks()" );

		const publicKey = await this.jwtService.getPublicKey();
		const jwk = await jose.exportJWK( publicKey );
		return { keys: [ jwk ] };
	}

	@Post( "login" )
	async login( @Body() data: LoginInput, @Res() res: Response ): Promise<User> {
		this.logger.debug( ">> login()" );
		this.logger.debug( "Data: %o", data );

		const { token, user }: LoginCommandResponse = await this.commandBus.execute( new LoginCommand( data ) );
		res.cookie( "identity", token, accessTokenCookieOptions );
		return user;
	}

	@Get( "verify-email/:userId/:hash" )
	async verifyEmail( @Param() data: VerifyUserInput ): Promise<User> {
		this.logger.debug( ">> verifyEmail()" );
		this.logger.debug( "Data: %o", data );

		return this.commandBus.execute( new VerifyUserCommand( data ) );
	}

	@Post( "logout" )
	async logout( @Res() res: Response ) {
		this.logger.debug( ">> logout()" );
		res.clearCookie( "identity" );
	}
}