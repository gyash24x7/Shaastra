import type { User, PrismaClient } from "@prisma/client/identity/index.js";
import type { IEventHandler } from "@shaastra/framework";
import crypto from "crypto";
import dayjs from "dayjs";
import { AppEvents } from "./index.js";

const userCreatedEventHandler: IEventHandler<PrismaClient> = async function ( data: User, context ) {
	context.logger.debug( `Handling ${ AppEvents.USER_CREATED_EVENT }...` );
	context.logger.debug( "Data: ", data );

	const hash = crypto.randomBytes( 32 ).toString( "hex" );
	const expiry = dayjs().add( 2, "days" ).toDate();
	const token = await context.prisma.token.create( { data: { userId: data.id, hash, expiry } } );

	const link = `http://localhost:9000/api/auth/verify-email/${ data.id }/${ token.hash }`;
	const subject = "Verify your Shaastra Account";
	const content = `Please click here to verify your Shaastra Account ${ link }`;
	// await context.mailer.sendMail( { subject, content, email: user.email, name: user.name } );
	context.logger.debug( `Need to send mail here!` );
	context.logger.debug( `Subject: ${ subject }` );
	context.logger.debug( `Content: ${ content }` );
};

export default userCreatedEventHandler;