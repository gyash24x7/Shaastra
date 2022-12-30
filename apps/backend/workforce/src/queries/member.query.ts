import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppQueries } from "./index.js";
import { prisma } from "../index.js";

export default async function memberQueryHandler( _data: unknown, _context: ServiceContext ) {
	const data = _data as { id: string };

	logger.debug( `Handling ${ AppQueries.MEMBER_QUERY }...` );
	logger.debug( "Data: %o", data );

	return prisma.member.findUnique( { where: { id: data.id } } );
};
