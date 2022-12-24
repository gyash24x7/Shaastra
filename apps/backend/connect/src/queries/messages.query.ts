import type { AppContext } from "../index.js";

export default async function messagesQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { channelId: string };
	return context.prisma.channel.findUniqueOrThrow( { where: { id: data.channelId } } ).messages();
}