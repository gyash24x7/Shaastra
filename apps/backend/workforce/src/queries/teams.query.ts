import type { AppContext } from "../index.js";
import { logger } from "@shaastra/framework";
import { AppQueries } from "./index.js";

export default async function teamsQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { memberId: string };

	logger.debug( `Handling ${ AppQueries.TEAMS_QUERY }...` );
	logger.debug( "Data: ", data );

	return context.prisma.member.findUniqueOrThrow( { where: { id: data.memberId } } ).teams();
};
