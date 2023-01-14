import { MemberPosition, PrismaClient, type Member } from "@prisma/client/workforce/index.js";
import type { IEventHandler } from "@shaastra/framework";
import { MemberMessages } from "../constants/messages.js";

const memberCreatedEventHandler: IEventHandler<PrismaClient> = async function ( data: Member, context ) {
	const member = await context.prisma.member.findFirst( {
		where: { department: data.department, position: MemberPosition.CORE }
	} );

	if ( !member ) {
		context.logger.error( MemberMessages.NOT_FOUND );
		return;
	}

	const subject = `New Member requested to join ${ data.department }`;
	const content = `Please log in to Shaastra Prime and approve this request.`;
	// await context.mailer.sendMail( { subject, content, email: member.email, name: member.name } );
	context.logger.debug( `Need to send mail here!` );
	context.logger.debug( `Subject: ${ subject }` );
	context.logger.debug( `Content: ${ content }` );
	context.logger.debug( `Member: ${ member.name }` );
};

export default memberCreatedEventHandler;