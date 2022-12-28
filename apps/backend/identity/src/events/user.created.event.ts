import type { Token, User } from "@prisma/client/identity/index.js";
import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppEvents } from "./index.js";

export default async function userCreatedEventHandler( _data: unknown, context: ServiceContext ) {
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