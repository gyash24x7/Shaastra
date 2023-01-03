import type { Member } from "@prisma/client/workforce/index.js";
import { MemberPosition } from "@prisma/client/workforce/index.js";
import { logger } from "../index.js";
import type { ServiceContext } from "@shaastra/framework";
import { prisma } from "../prisma/index.js";

export default async function memberCreatedEventHandler( data: Member, _context: ServiceContext ) {
	const member = await prisma.member.findFirstOrThrow( {
		where: { department: data.department, position: MemberPosition.CORE }
	} );

	const subject = `New Member requested to join ${ data.department }`;
	const content = `Please log in to Shaastra Prime and approve this request.`;
	// await context.mailer.sendMail( { subject, content, email: member.email, name: member.name } );
	logger.debug( `Need to send mail here!` );
	logger.debug( `Subject: ${ subject }` );
	logger.debug( `Content: ${ content }` );
	logger.debug( `Member: ${ member.name }` );
}