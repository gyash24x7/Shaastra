import { logger } from "@shaastra/framework";
import type { AppContext } from "../index.js";
import { AppQueries } from "./index.js";

export default async function messagesQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { channelId: string };

	logger.debug( `Handling ${ AppQueries.MESSAGES_QUERY }...` );
	logger.debug( "Data: ", data );

	return context.prisma.channel.findUniqueOrThrow( { where: { id: data.channelId } } ).messages();
}