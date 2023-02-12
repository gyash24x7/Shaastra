import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtService, LoggerFactory } from "@shaastra/framework";
import type { CookieOptions, Response } from "express";
import { exportJWK } from "jose";
import {
	LoginCommand,
	LoginCommandResponse,
	LoginInput,
	VerifyUserCommand,
	VerifyUserInput
} from "../commands/index.js";

export const accessTokenCookieOptions: CookieOptions = {
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
		const jwk = await exportJWK( publicKey );
		return { keys: [ jwk ] };
	}

	@Post( "login" )
	async login( @Body() data: LoginInput, @Res() res: Response ) {
		this.logger.debug( ">> login()" );
		this.logger.debug( "Data: %o", data );

		const { token, user }: LoginCommandResponse = await this.commandBus.execute( new LoginCommand( data ) );
		res.cookie( "identity", token, accessTokenCookieOptions );
		res.status( 200 ).send( user );
	}

	@Get( "verify-email/:userId/:hash" )
	async verifyEmail( @Param() data: VerifyUserInput, @Res() res: Response ) {
		this.logger.debug( ">> verifyEmail()" );
		this.logger.debug( "Data: %o", data );
		await this.commandBus.execute( new VerifyUserCommand( data ) );
		res.redirect( "http://localhost:3000/auth/login" );
	}

	@Post( "logout" )
	async logout( @Res() res: Response ) {
		this.logger.debug( ">> logout()" );
		res.clearCookie( "identity" );
	}
}