import type { PrismaClient } from "@prisma/client/identity";
import { RestApi } from "@shaastra/framework";
import bcrypt from "bcryptjs";
import { UserMessages } from "../constants/messages.js";
import { AppEvents } from "../events/index.js";

export type CreateUserInput = {
	name: string;
	email: string;
	password: string;
	username: string;
}

export const signupApi = new RestApi<PrismaClient>( {
	path: "/api/auth/signup",
	method: "POST",
	async handler( context ) {
		const data: CreateUserInput = context.req.body;
		const existingUser = await context.prisma.user.findUnique( { where: { username: data.username } } );

		if ( existingUser ) {
			context.logger.error( `${ UserMessages.ALREADY_EXISTS } Username: ${ data.username }` );
			throw new Error( UserMessages.ALREADY_EXISTS );
		}

		data.password = await bcrypt.hash( data.password, 10 );

		const user = await context.prisma.user.create( { data } );
		context.eventBus.execute( AppEvents.USER_CREATED_EVENT, user, context );
		context.res.send( user );
	}
} );