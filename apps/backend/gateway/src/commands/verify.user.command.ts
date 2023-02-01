import { BadRequestException, NotFoundException } from "@nestjs/common";
import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler } from "@nestjs/cqrs";
import type { User } from "@prisma/client/identity/index.js";
import { LoggerFactory } from "@shaastra/framework";
import dayjs from "dayjs";
import { TokenMessages, UserMessages } from "../constants/messages.js";
import { PrismaService } from "../prisma/prisma.service.js";

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

	constructor( private readonly prismaService: PrismaService ) {}

	async execute( { data: { userId, hash } }: VerifyUserCommand ) {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { userId, hash } );

		const user = await this.prismaService.user.findUnique( { where: { id: userId } } );
		if ( !user ) {
			throw new NotFoundException( UserMessages.NOT_FOUND );
		}

		const token = await this.prismaService.token.findFirst( { where: { userId, hash } } );
		if ( !token ) {
			throw  new NotFoundException( TokenMessages.NOT_FOUND );
		}

		if ( dayjs().isAfter( token.expiry ) ) {
			throw new BadRequestException( TokenMessages.EXPIRED );
		}

		const updatedUser = await this.prismaService.user.update( {
			where: { id: userId },
			data: { verified: true }
		} );

		await this.prismaService.token.delete( { where: { id: token.id } } );

		return updatedUser;
	}

}