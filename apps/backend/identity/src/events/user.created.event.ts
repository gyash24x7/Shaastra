import type { Token, User } from "@prisma/client/identity/index.js";
import type { AppContext } from "../index.js";

export default async function userCreatedEventHandler( data: unknown, context: AppContext ) {
	const user = data as User;
	const token: Token = await context.commandBus.execute( "CREATE_TOKEN_COMMAND", { userId: user.id }, context );
	const link = `http://localhost:3000/verify/${ user.id }/${ token.id }`;
	const subject = "Verify your Shaastra Account";
	const content = `Please click here to verify your Shaastra Account ${ link }`;
	// await context.mailer.sendMail( { subject, content, email: user.email, name: user.name } );
	context.logger.debug( `Need to send mail here!` );
	context.logger.debug( `Subject: ${ subject }` );
	context.logger.debug( `Content: ${ content }` );
}