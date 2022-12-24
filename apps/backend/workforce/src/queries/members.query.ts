import type { AppContext } from "../index.js";

export default async function membersQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { teamId: string };
	return context.prisma.team.findUniqueOrThrow( { where: { id: data.teamId } } ).members();
};
