import type { Member, Team } from "@prisma/client/workforce/index.js";
import { logger } from "../index.js";

export default async function teamCreatedEventHandler( data: Team & { members: Member[] } ) {
	const subject = `Welcome to ${ data.name } Team`;
	const content = `You have been added to a new team under ${ data.department }`;

	await Promise.all( data.members.map( () => {
		logger.debug( `Need to send mail here!` );
		logger.debug( `Subject: ${ subject }` );
		logger.debug( `Content: ${ content }` );
	} ) );
};
