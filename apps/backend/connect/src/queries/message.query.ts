import type { AppContext } from "../index.js";

export default async function messageQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { id: string };
	return context.prisma.message.findUnique( { where: { id: data.id } } );
};
