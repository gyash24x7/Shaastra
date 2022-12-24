import { AppEvents } from "../events/index.js";
import type { EnableMemberInput } from "../graphql/inputs.js";
import type { AppContext } from "../index.js";

export default async function enableMemberCommandHandler( _data: unknown, context: AppContext ) {
	const data = _data as EnableMemberInput;

	const member = await context.prisma.member.update( {
		where: { id: data.id },
		data: { enabled: true }
	} );

	context.eventBus.execute( AppEvents.MEMBER_ENABLED_EVENT, member, context );
	return true;
}