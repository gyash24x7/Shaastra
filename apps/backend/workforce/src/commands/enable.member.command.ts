import { logger } from "@shaastra/framework";
import { AppEvents } from "../events/index.js";
import type { EnableMemberInput } from "../graphql/inputs.js";
import type { AppContext } from "../index.js";
import { AppCommands } from "./index.js";

export default async function enableMemberCommandHandler( _data: unknown, context: AppContext ) {
	const data = _data as EnableMemberInput;

	logger.debug( `Handling ${ AppCommands.CREATE_MEMBER_COMMAND }...` );
	logger.debug( "Data: ", data );

	const member = await context.prisma.member.update( {
		where: { id: data.id },
		data: { enabled: true }
	} );

	logger.debug( `Member Enabled Successfully! ${ member.id }` );

	context.eventBus.execute( AppEvents.MEMBER_ENABLED_EVENT, member, context );
	return member.id;
}