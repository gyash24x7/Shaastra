import type { AppContext } from "../index.js";
import { logger } from "@shaastra/framework";
import { AppQueries } from "./index.js";

export default async function memberQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { id: string };

	logger.debug( `Handling ${ AppQueries.MEMBER_QUERY }...` );
	logger.debug( "Data: ", data );

	return context.prisma.member.findUnique( { where: { id: data.id } } );
};
