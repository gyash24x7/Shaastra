import type { Member, PrismaClient } from "@prisma/client/workforce/index.js";
import type { IQuery, IQueryHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";


export class MembersQuery implements IQuery<{ teamId: string }, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: { teamId: string },
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IQueryHandler<MembersQuery, Member[]> = async ( { data, context } ) => {
		return context.prisma.team.findUniqueOrThrow( { where: { id: data.teamId } } ).members();
	};
}