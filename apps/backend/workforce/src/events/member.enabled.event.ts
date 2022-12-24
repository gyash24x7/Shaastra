import type { Member } from "@prisma/client/workforce/index.js";
import type { AppContext } from "../index.js";

export default async function memberEnabledEventHandler( _data: unknown, context: AppContext ) {
	const data = _data as Member;
	const subject = `Your Shaastra Prime Account is Enabled`;
	const content = `Hi ${ data.name }, You can now use Shaastra Prime.`;
	context.logger.scope( "MemberEnabledEventHandler" ).debug( `Need to send mail here!` );
	context.logger.scope( "MemberEnabledEventHandler" ).debug( `Subject: ${ subject }` );
	context.logger.scope( "MemberEnabledEventHandler" ).debug( `Content: ${ content }` );
};
