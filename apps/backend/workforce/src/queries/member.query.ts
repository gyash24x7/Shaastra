import type { Member, PrismaClient } from "@prisma/client/workforce/index.js";
import type { IQuery, IQueryHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";


export class MemberQuery implements IQuery<{ id: string }, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: { id: string },
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IQueryHandler<MemberQuery, Member | null> = async ( { data, context } ) => {
		return context.prisma.member.findUnique( { where: { id: data.id } } );
	};
}