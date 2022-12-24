import type { AppContext } from "../index.js";

export default async function channelQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { id: string };
	return context.prisma.channel.findUnique( { where: { id: data.id } } );
};
