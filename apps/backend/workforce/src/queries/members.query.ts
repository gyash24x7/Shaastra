import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppQueries } from "./index.js";
import { prisma } from "../index.js";

export default async function membersQueryHandler( _data: unknown, _context: ServiceContext ) {
	const data = _data as { teamId: string };

	logger.debug( `Handling ${ AppQueries.MEMBERS_QUERY }...` );
	logger.debug( "Data: %o", data );

	return prisma.team.findUniqueOrThrow( { where: { id: data.teamId } } ).members();
};
