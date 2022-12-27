import type { Member, Team } from "@prisma/client/workforce/index.js";
import type { AppContext } from "../index.js";
import { AppCommands } from "../commands/index.js";
import { logger } from "@shaastra/framework";

export default async function teamCreatedEventHandler( _data: unknown, _context: AppContext ) {
	const data = _data as Team & { members: Member[] };

	logger.debug( `Handling ${ AppCommands.CREATE_MEMBER_COMMAND }...` );
	logger.debug( "Data: ", data );

	const subject = `Welcome to ${ data.name } Team`;
	const content = `You have been added to a new team under ${ data.department }`;

	await Promise.all( data.members.map( () => {
		logger.debug( `Need to send mail here!` );
		logger.debug( `Subject: ${ subject }` );
		logger.debug( `Content: ${ content }` );
	} ) );
};
