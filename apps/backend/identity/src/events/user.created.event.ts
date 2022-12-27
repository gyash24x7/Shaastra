import type { Token, User } from "@prisma/client/identity/index.js";
import type { AppContext } from "../index.js";
import { AppEvents } from "./index.js";
import { logger } from "@shaastra/framework";

export default async function userCreatedEventHandler( _data: unknown, context: AppContext ) {
	const user = _data as User;

	logger.debug( `Handling ${ AppEvents.USER_CREATED_EVENT }...` );
	logger.debug( "Data: ", user );

	const token: Token = await context.commandBus.execute( "CREATE_TOKEN_COMMAND", { userId: user.id }, context );

	const link = `http://localhost:3000/verify/${ user.id }/${ token.id }`;
	const subject = "Verify your Shaastra Account";
	const content = `Please click here to verify your Shaastra Account ${ link }`;
	// await context.mailer.sendMail( { subject, content, email: user.email, name: user.name } );
	logger.debug( `Need to send mail here!` );
	logger.debug( `Subject: ${ subject }` );
	logger.debug( `Content: ${ content }` );
}