import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppQueries } from "./index.js";
import { prisma } from "../index.js";

export default async function messagesQueryHandler( _data: unknown, _context: ServiceContext ) {
	const data = _data as { channelId: string };

	logger.debug( `Handling ${ AppQueries.MESSAGES_QUERY }...` );
	logger.debug( "Data: %o", data );

	return prisma.channel.findUniqueOrThrow( { where: { id: data.channelId } } ).messages();
}