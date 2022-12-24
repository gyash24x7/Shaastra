import type { AppContext } from "../index.js";

export default async function memberQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { id: string };
	return context.prisma.member.findUnique( { where: { id: data.id } } );
};
