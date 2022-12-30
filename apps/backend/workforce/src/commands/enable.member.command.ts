import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppEvents } from "../events/index.js";
import type { EnableMemberInput } from "../graphql/inputs.js";
import { AppCommands } from "./index.js";
import { prisma } from "../index.js";

export default async function enableMemberCommandHandler( _data: unknown, context: ServiceContext ) {
	const data = _data as EnableMemberInput;

	logger.debug( `Handling ${ AppCommands.CREATE_MEMBER_COMMAND }...` );
	logger.debug( "Data: %o", data );

	const member = await prisma.member.update( {
		where: { id: data.id },
		data: { enabled: true }
	} );

	logger.debug( `Member Enabled Successfully! ${ member.id }` );

	context.eventBus.execute( AppEvents.MEMBER_ENABLED_EVENT, member, context );
	return member.id;
}