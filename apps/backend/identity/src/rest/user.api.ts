import { RestApi } from "@shaastra/framework";
import bcrypt from "bcryptjs";
import { eventBus, logger } from "..";
import { AppEvents } from "../events";
import { UserMessages } from "../messages/user.messages";
import { prisma } from "../prisma";

export type CreateUserInput = {
	name: string;
	email: string;
	password: string;
	roles: string[];
	username: string;
}

export const userRestApi = new RestApi( {
	method: "POST",
	path: "/api/users",
	async handler( context ) {
		const data: CreateUserInput = context.req.body;
		const existingUser = await prisma.user.findUnique( { where: { username: data.username } } );

		if ( existingUser ) {
			logger.error( `${ UserMessages.ALREADY_EXISTS } Username: ${ data.username }` );
			throw new Error( UserMessages.ALREADY_EXISTS );
		}

		data.password = await bcrypt.hash( data.password, 10 );

		const user = await prisma.user.create( { data: data } );
		eventBus.execute( AppEvents.USER_CREATED_EVENT, user, context );
		context.res.send( user );
	}
} );