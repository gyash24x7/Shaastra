import type { Member } from "@prisma/client/workforce/index.js";
import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppEvents } from "./index.js";

export default async function memberEnabledEventHandler( _data: unknown, _context: ServiceContext ) {
	const data = _data as Member;

	logger.debug( `Handling ${ AppEvents.MEMBER_ENABLED_EVENT }...` );
	logger.debug( "Data: %o", data );

	const subject = `Your Shaastra Prime Account is Enabled`;
	const content = `Hi ${ data.name }, You can now use Shaastra Prime.`;
	logger.debug( `Need to send mail here!` );
	logger.debug( `Subject: ${ subject }` );
	logger.debug( `Content: ${ content }` );
};
