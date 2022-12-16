import type { PrismaClient, Team } from "@prisma/client/workforce/index.js";
import type { IQuery, IQueryHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";


export class TeamQuery implements IQuery<{ id: string }, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: { id: string },
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IQueryHandler<TeamQuery, Team | null> = async ( { data, context } ) => {
		return context.prisma.team.findUnique( { where: { id: data.id } } );
	};
}