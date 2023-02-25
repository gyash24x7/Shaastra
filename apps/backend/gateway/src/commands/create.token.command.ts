import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler } from "@nestjs/cqrs";
import type { PrismaClient, Token } from "@prisma/client/gateway";
import crypto from "crypto";
import dayjs from "dayjs";

export type CreateTokenInput = { userId: string };

export class CreateTokenCommand implements ICommand {
	constructor( public readonly data: CreateTokenInput ) {}
}

@CommandHandler( CreateTokenCommand )
export class CreateTokenCommandHandler implements ICommandHandler<CreateTokenCommand, Token> {
	private readonly logger = LoggerFactory.getLogger( CreateTokenCommandHandler );

	constructor( @Prisma() private readonly prismaService: PrismaService<PrismaClient> ) {}

	execute( { data: { userId } }: CreateTokenCommand ) {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { userId } );

		const hash = crypto.randomBytes( 32 ).toString( "hex" );
		const expiry = dayjs().add( 2, "days" ).toDate();
		return this.prismaService.client.token.create( { data: { userId, hash, expiry } } );
	};
}