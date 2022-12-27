import type { Member } from "@prisma/client/workforce/index.js";
import { AppQueries } from "../queries/index.js";
import type { AppContext } from "../index.js";
import { logger } from "@shaastra/framework";
import { AppEvents } from "./index.js";

export default async function memberCreatedEventHandler( _data: unknown, context: AppContext ) {
	const data = _data as Member;

	logger.debug( `Handling ${ AppEvents.MEMBER_CREATED_EVENT }...` );
	logger.debug( "Data: ", data );

	const member: Member = await context.queryBus.execute(
		AppQueries.DEPT_CORE_QUERY,
		{ department: data.department },
		context
	);

	const subject = `New Member requested to join ${ data.department }`;
	const content = `Please log in to Shaastra Prime and approve this request.`;
	// await context.mailer.sendMail( { subject, content, email: member.email, name: member.name } );
	logger.debug( `Need to send mail here!` );
	logger.debug( `Subject: ${ subject }` );
	logger.debug( `Content: ${ content }` );
	logger.debug( `Member: ${ member.name }` );
}