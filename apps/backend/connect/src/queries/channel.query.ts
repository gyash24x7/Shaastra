import { logger } from "@shaastra/framework";
import type { AppContext } from "../index.js";
import { AppQueries } from "./index.js";

export default async function channelQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { id: string };

	logger.debug( `Handling ${ AppQueries.CHANNEL_QUERY }...` );
	logger.debug( "Data: ", data );

	return context.prisma.channel.findUnique( { where: { id: data.id } } );
};
