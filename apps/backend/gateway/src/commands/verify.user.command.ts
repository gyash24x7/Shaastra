import { BadRequestException, NotFoundException } from "@nestjs/common";
import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler } from "@nestjs/cqrs";
import type { PrismaClient, User } from "@prisma/client/identity/index.js";
import { LoggerFactory, Prisma, PrismaService } from "@shaastra/framework";
import dayjs from "dayjs";
import { TokenMessages, UserMessages } from "../constants/messages.js";

export class VerifyUserInput {
	userId: string;
	hash: string;
}

export class VerifyUserCommand implements ICommand {
	constructor( public readonly data: VerifyUserInput ) {}
}

@CommandHandler( VerifyUserCommand )
export class VerifyUserCommandHandler implements ICommandHandler<VerifyUserCommand, User> {
	private readonly logger = LoggerFactory.getLogger( VerifyUserCommandHandler );

	constructor( @Prisma() private readonly prismaService: PrismaService<PrismaClient> ) {}

	async execute( { data: { userId, hash } }: VerifyUserCommand ) {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { userId, hash } );

		const user = await this.prismaService.client.user.findUnique( { where: { id: userId } } );
		if ( !user ) {
			throw new NotFoundException( UserMessages.NOT_FOUND );
		}

		const token = await this.prismaService.client.token.findFirst( { where: { userId, hash } } );
		if ( !token ) {
			throw  new NotFoundException( TokenMessages.NOT_FOUND );
		}

		if ( dayjs().isAfter( token.expiry ) ) {
			throw new BadRequestException( TokenMessages.EXPIRED );
		}

		const updatedUser = await this.prismaService.client.user.update( {
			where: { id: userId },
			data: { verified: true }
		} );

		await this.prismaService.client.token.delete( { where: { id: token.id } } );

		return updatedUser;
	}

}