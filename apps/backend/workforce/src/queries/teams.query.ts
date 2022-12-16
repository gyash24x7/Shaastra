import type { PrismaClient, Team } from "@prisma/client/workforce/index.js";
import type { IQuery, IQueryHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";


export class TeamsQuery implements IQuery<{ memberId: string }, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: { memberId: string },
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IQueryHandler<TeamsQuery, Team[]> = async ( { data, context } ) => {
		return context.prisma.member.findUniqueOrThrow( { where: { id: data.memberId } } ).teams();
	};
}