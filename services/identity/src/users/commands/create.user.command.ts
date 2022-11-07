import { CommandHandler, EventBus, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ConflictException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { UserMessages } from "../user.messages";
import { UserCreatedEvent } from "../events/user.created.event";
import { PrismaService } from "../../prisma/prisma.service";

export type CreateUserInput = {
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
	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: CreateUserCommand ): Promise<string> {
		const existingUser = await this.prismaService.user.findUnique( { where: { username: data.username } } );

		if ( existingUser ) {
			throw new ConflictException( UserMessages.ALREADY_EXISTS );
		}

		data.password = await bcrypt.hash( data.password, 10 );

		const user = await this.prismaService.user.create( { data } );
		this.eventBus.publish( new UserCreatedEvent( user ) );
		return user.id;
	}
}