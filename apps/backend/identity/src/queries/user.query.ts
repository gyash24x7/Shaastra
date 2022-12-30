import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppQueries } from "./index.js";
import { prisma } from "../index.js";

export default async function userQueryHandler( data: unknown, _context: ServiceContext ) {
	const { id } = data as { id: string };

	logger.debug( `Handling ${ AppQueries.USER_QUERY }....` );
	logger.debug( "Data: %o", data );

	return prisma.user.findUnique( { where: { id } } );
}