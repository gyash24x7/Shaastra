import type { User } from "@prisma/client/identity/index.js";
import type { ServiceContext } from "@shaastra/framework";
import crypto from "crypto";
import dayjs from "dayjs";
import { logger } from "../index.js";
import { prisma } from "../prisma/index.js";
import { AppEvents } from "./index.js";

export default async function userCreatedEventHandler( data: User, _context: ServiceContext ) {
	logger.debug( `Handling ${ AppEvents.USER_CREATED_EVENT }...` );
	logger.debug( "Data: ", data );

	const randomToken = crypto.randomBytes( 32 ).toString( "hex" );
	const expiry = dayjs().add( 2, "days" ).toDate();
	const token = await prisma.token.create( { data: { userId: data.id, token: randomToken, expiry } } );

	const link = `http://localhost:3000/verify/${ data.id }/${ token.id }`;
	const subject = "Verify your Shaastra Account";
	const content = `Please click here to verify your Shaastra Account ${ link }`;
	// await context.mailer.sendMail( { subject, content, email: user.email, name: user.name } );
	logger.debug( `Need to send mail here!` );
	logger.debug( `Subject: ${ subject }` );
	logger.debug( `Content: ${ content }` );
}