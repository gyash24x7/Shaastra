import type { AppContext } from "../index.js";

export default async function userQueryHandler( data: unknown, context: AppContext ) {
	const { id } = data as { id: string };
	return context.prisma.user.findUnique( { where: { id } } );
}