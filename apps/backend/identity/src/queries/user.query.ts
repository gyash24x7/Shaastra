import { logger } from "@shaastra/framework";
import type { AppContext } from "../index.js";
import { AppQueries } from "./index.js";

export default async function userQueryHandler( data: unknown, context: AppContext ) {
	const { id } = data as { id: string };

	logger.debug( `Handling ${ AppQueries.USER_QUERY }....` );
	logger.debug( "Data: ", data );

	return context.prisma.user.findUnique( { where: { id } } );
}