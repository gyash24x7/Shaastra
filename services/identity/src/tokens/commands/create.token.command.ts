import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler } from "@nestjs/cqrs";
import * as crypto from "crypto";
import type { Token } from "@prisma/client/identity";
import dayjs from "dayjs";
import type { IdentityPrismaService } from "../../app/identity.prisma.service";

export type CreateTokenInput = { userId: string, token?: string };

export class CreateTokenCommand implements ICommand {
	constructor( public readonly data: CreateTokenInput ) {}
}

@CommandHandler( CreateTokenCommand )
export class CreateTokenCommandHandler implements ICommandHandler<CreateTokenCommand, Token> {
	constructor( private readonly prismaService: IdentityPrismaService ) {}

	execute( { data: { userId, token } }: CreateTokenCommand ): Promise<Token> {
		token = token || crypto.randomBytes( 32 ).toString( "hex" );
		const expiry = dayjs().add( 2, "days" ).toDate();
		return this.prismaService.token.create( { data: { userId, token, expiry } } )
	}
}