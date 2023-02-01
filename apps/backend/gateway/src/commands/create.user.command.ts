import { ConflictException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { LoggerFactory } from "@shaastra/framework";
import bcrypt from "bcryptjs";
import { UserMessages } from "../constants/messages.js";
import { UserCreatedEvent } from "../events/user.created.event.js";
import { PrismaService } from "../prisma/prisma.service.js";

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
		private readonly prismaService: PrismaService,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: CreateUserCommand ): Promise<string> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", data );

		const existingUser = await this.prismaService.user.findFirst( {
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

		const user = await this.prismaService.user.create( { data } );
		this.eventBus.publish( new UserCreatedEvent( user ) );
		return user.id;
	}
}