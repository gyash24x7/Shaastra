import type { Member, Team } from "@prisma/client/workforce/index.js";
import type { AppContext } from "../index.js";

export default async function teamCreatedEventHandler( _data: unknown, context: AppContext ) {
	const data = _data as Team & { members: Member[] };
	const subject = `Welcome to ${ data.name } Team`;
	const content = `You have been added to a new team under ${ data.department }`;
	await Promise.all( data.members.map( () => {
		context.logger.debug( `Need to send mail here!` );
		context.logger.debug( `Subject: ${ subject }` );
		context.logger.debug( `Content: ${ content }` );
	} ) );
};
