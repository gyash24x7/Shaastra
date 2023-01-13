import type { Member, Team, PrismaClient } from "@prisma/client/workforce/index.js";
import type { IEventHandler } from "@shaastra/framework";

const teamCreatedEventHandler: IEventHandler<PrismaClient> = async function (
	data: Team & { members: Member[] },
	context
) {
	const subject = `Welcome to ${ data.name } Team`;
	const content = `You have been added to a new team under ${ data.department }`;

	await Promise.all( data.members.map( () => {
		context.logger.debug( `Need to send mail here!` );
		context.logger.debug( `Subject: ${ subject }` );
		context.logger.debug( `Content: ${ content }` );
	} ) );
};

export default teamCreatedEventHandler;
