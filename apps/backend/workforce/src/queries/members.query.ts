import type { AppContext } from "../index.js";
import { logger } from "@shaastra/framework";
import { AppQueries } from "./index.js";

export default async function membersQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { teamId: string };

	logger.debug( `Handling ${ AppQueries.MEMBERS_QUERY }...` );
	logger.debug( "Data: ", data );

	return context.prisma.team.findUniqueOrThrow( { where: { id: data.teamId } } ).members();
};
