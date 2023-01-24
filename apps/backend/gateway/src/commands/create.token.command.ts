import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler } from "@nestjs/cqrs";
import crypto from "crypto";
import type { Token } from "@prisma/client/identity/index.js";
import { PrismaService } from "../prisma/prisma.service.js";
import dayjs from "dayjs";
import { LoggerFactory } from "@shaastra/framework";

export type CreateTokenInput = { userId: string };

export class CreateTokenCommand implements ICommand {
	constructor( public readonly data: CreateTokenInput ) {}
}

@CommandHandler( CreateTokenCommand )
export class CreateTokenCommandHandler implements ICommandHandler<CreateTokenCommand, Token> {
	private readonly logger = LoggerFactory.getLogger( CreateTokenCommandHandler );

	constructor( private readonly prismaService: PrismaService ) {}

	execute( { data: { userId } }: CreateTokenCommand ): Promise<Token> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { userId } );

		const hash = crypto.randomBytes( 32 ).toString( "hex" );
		const expiry = dayjs().add( 2, "days" ).toDate();
		return this.prismaService.token.create( { data: { userId, hash, expiry } } );
	}
}