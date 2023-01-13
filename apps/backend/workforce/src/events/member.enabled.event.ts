import type { Member, PrismaClient } from "@prisma/client/workforce/index.js";
import type { IEventHandler } from "@shaastra/framework";

const memberEnabledEventHandler: IEventHandler<PrismaClient> = async function ( data: Member, context ) {
	const subject = `Your Shaastra Prime Account is Enabled`;
	const content = `Hi ${ data.name }, You can now use Shaastra Prime.`;
	context.logger.debug( `Need to send mail here!` );
	context.logger.debug( `Subject: ${ subject }` );
	context.logger.debug( `Content: ${ content }` );
};

export default memberEnabledEventHandler;