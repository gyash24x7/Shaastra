import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand, LoginCommand } from "./user.commands";
import type { AuthResponsePayload } from "./user.dtos";
import { IdentityPrismaService } from "@shaastra/prisma";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { UserMessages } from "./user.messages";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { readFileSync } from "fs";
import { join } from "path";
import { ConfigService } from "@nestjs/config";

@CommandHandler( LoginCommand )
export class LoginCommandHandler implements ICommandHandler<LoginCommand, AuthResponsePayload> {
	constructor(
		private readonly prismaService: IdentityPrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {}

	async execute( { data }: LoginCommand ): Promise<AuthResponsePayload> {
		const user = await this.prismaService.user.findUnique( { where: { username: data.username } } );

		if ( !user ) {
			throw new NotFoundException( UserMessages.NOT_FOUND );
		}

		const doPasswordsMatch = await bcrypt.compare( data.password, user.password );
		if ( !doPasswordsMatch ) {
			throw new BadRequestException( UserMessages.INVALID_CREDENTIALS );
		}

		const audience = this.configService.getOrThrow<string>( "app.auth.audience" );
		const issuer = `https://${ this.configService.getOrThrow<string>( "app.auth.domain" ) }`;
		const keyid = process.env[ "KEY_ID" ]!;
		const algorithm = "RS256";

		const privateKey = readFileSync( join( __dirname, "assets", "keys", ".private.key" ) );
		const token = await this.jwtService.signAsync( user, { privateKey, algorithm, audience, issuer, keyid } );

		return { user, token };
	}
}

@CommandHandler( CreateUserCommand )
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, AuthResponsePayload> {
	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: IdentityPrismaService,
		private readonly jwtService: JwtService
	) {}

	async execute( { data }: CreateUserCommand ): Promise<AuthResponsePayload> {
		const existingUser = await this.prismaService.user.findUnique( { where: { username: data.username } } );

		if ( existingUser ) {
			throw new ConflictException( UserMessages.ALREADY_EXISTS );
		}

		data.password = await bcrypt.hash( data.password, 10 );

		const user = await this.prismaService.user.create( { data } );

		const audience = this.configService.getOrThrow<string>( "app.auth.audience" );
		const issuer = `https://${ this.configService.getOrThrow<string>( "app.auth.domain" ) }`;
		const keyid = process.env[ "KEY_ID" ]!;
		const algorithm = "RS256";

		const privateKey = readFileSync( join( __dirname, "assets", "keys", ".private.key" ) );
		const token = await this.jwtService.signAsync( user, { privateKey, algorithm, audience, issuer, keyid } );

		return { user, token };
	}
}

export const commandHandlers = [ LoginCommandHandler, CreateUserCommandHandler ];