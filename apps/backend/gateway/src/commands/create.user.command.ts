import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import { ConflictException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommand, ICommandHandler } from "@nestjs/cqrs";
import type { PrismaClient } from "@prisma/client/gateway";
import bcrypt from "bcryptjs";
import { UserMessages } from "../constants";
import { UserCreatedEvent } from "../events";

export type CreateUserInput = {
	id: string;
	name: string;
	email: string;
	password: string;
	username: string;
	roles: string[];
}

export class CreateUserCommand implements ICommand {
	constructor( public readonly data: CreateUserInput ) {}
}

@CommandHandler( CreateUserCommand )
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, string> {
	private readonly logger = LoggerFactory.getLogger( CreateUserCommandHandler );

	constructor(
		@Prisma() private readonly prismaService: PrismaService<PrismaClient>,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: CreateUserCommand ): Promise<string> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", data );

		const existingUser = await this.prismaService.client.user.findFirst( {
			where: {
				OR: {
					username: data.username,
					email: data.email,
					id: data.id
				}
			}
		} );

		if ( !!existingUser ) {
			throw new ConflictException( UserMessages.ALREADY_EXISTS );
		}

		data.password = await bcrypt.hash( data.password, 10 );

		const user = await this.prismaService.client.user.create( { data } );
		this.eventBus.publish( new UserCreatedEvent( user ) );
		return user.id;
	}
}