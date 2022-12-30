import { UserMessages } from "../messages/user.messages.js";
import bcrypt from "bcryptjs";
import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppEvents } from "../events/index.js";
import { AppCommands } from "./index.js";
import { prisma } from "../index.js";

export type CreateUserInput = {
	name: string;
	email: string;
	password: string;
	username: string;
	roles: string[];
}

export default async function createUserCommandHandler( _data: unknown, context: ServiceContext ) {
	let data = _data as CreateUserInput;

	logger.debug( `Handling ${ AppCommands.CREATE_USER_COMMAND }...` );
	logger.debug( "Data: %o", data );

	const existingUser = await prisma.user.findUnique( { where: { username: data.username } } );

	if ( existingUser ) {
		logger.error( `${ UserMessages.ALREADY_EXISTS } Username: ${ data.username }` );
		throw new Error( UserMessages.ALREADY_EXISTS );
	}

	data.password = await bcrypt.hash( data.password, 10 );

	const user = await prisma.user.create( { data: data } );
	await context.eventBus.execute( AppEvents.USER_CREATED_EVENT, user, context );
	return user.id;
}