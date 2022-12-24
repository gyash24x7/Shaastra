import type { AppContext } from "../index.js";

export default async function teamsQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { memberId: string };
	return context.prisma.member.findUniqueOrThrow( { where: { id: data.memberId } } ).teams();
};
