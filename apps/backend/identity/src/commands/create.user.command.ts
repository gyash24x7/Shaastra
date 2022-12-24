import { UserMessages } from "../messages/user.messages.js";
import bcrypt from "bcryptjs";
import type { AppContext } from "../index.js";
import { AppEvents } from "../events/index.js";

export type CreateUserInput = {
	name: string;
	email: string;
	password: string;
	username: string;
	roles: string[];
}

export default async function createUserCommandHandler( data: unknown, context: AppContext ) {
	let input = data as CreateUserInput;
	const existingUser = await context.prisma.user.findUnique( { where: { username: input.username } } );

	if ( existingUser ) {
		throw new Error( UserMessages.ALREADY_EXISTS );
	}

	input.password = await bcrypt.hash( input.password, 10 );

	const user = await context.prisma.user.create( { data: input } );
	await context.eventBus.execute( AppEvents.USER_CREATED_EVENT, user, context );
	return user.id;
}