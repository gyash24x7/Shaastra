import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppQueries } from "./index.js";
import { prisma } from "../index.js";

export default async function teamsQueryHandler( _data: unknown, _context: ServiceContext ) {
	const data = _data as { memberId: string };

	logger.debug( `Handling ${ AppQueries.TEAMS_QUERY }...` );
	logger.debug( "Data: ", data );

	return prisma.member.findUniqueOrThrow( { where: { id: data.memberId } } ).teams();
};
