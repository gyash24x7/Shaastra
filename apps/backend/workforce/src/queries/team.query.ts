import type { AppContext } from "../index.js";

export default async function teamQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { id: string };
	return context.prisma.team.findUnique( { where: { id: data.id } } );
};
