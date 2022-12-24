import type { Member } from "@prisma/client/workforce/index.js";
import { AppQueries } from "../queries/index.js";
import type { AppContext } from "../index.js";

export default async function memberCreatedEventHandler( _data: unknown, context: AppContext ) {
	const data = _data as Member;
	const member: Member = await context.queryBus.execute(
		AppQueries.DEPT_CORE_QUERY,
		{ department: data.department },
		context
	);
	const subject = `New Member requested to join ${ data.department }`;
	const content = `Please log in to Shaastra Prime and approve this request.`;
	// await context.mailer.sendMail( { subject, content, email: member.email, name: member.name } );
	context.logger.scope( "MemberCreatedEventHandler" ).debug( `Need to send mail here!` );
	context.logger.scope( "MemberCreatedEventHandler" ).debug( `Subject: ${ subject }` );
	context.logger.scope( "MemberCreatedEventHandler" ).debug( `Content: ${ content }` );
	context.logger.scope( "MemberCreatedEventHandler" ).debug( `Member: ${ member.name }` );
}