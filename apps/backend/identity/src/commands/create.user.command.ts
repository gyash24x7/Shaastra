import type { PrismaClient } from "@prisma/client/identity/index.js";
import type { ICommand, ICommandHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import bcrypt from "bcryptjs";
import { UserCreatedEvent } from "../events/index.js";
import { UserMessages } from "../messages/user.messages.js";

export type CreateUserInput = {
	name: string;
	email: string;
	password: string;
	username: string;
	roles: string[];
}

export class CreateUserCommand implements ICommand<CreateUserInput, ServiceContext<PrismaClient>> {
	public readonly name = "CREATE_USER_COMMAND";

	constructor(
		public readonly data: CreateUserInput,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: ICommandHandler<CreateUserCommand, string> = async ( { data, context } ) => {
		const existingUser = await context.prisma.user.findUnique( { where: { username: data.username } } );

		if ( existingUser ) {
			throw new Error( UserMessages.ALREADY_EXISTS );
		}

		data.password = await bcrypt.hash( data.password, 10 );

		const user = await context.prisma.user.create( { data } );
		context.eventBus.publish( new UserCreatedEvent( user, context ) );
		return user.id;
	};
}