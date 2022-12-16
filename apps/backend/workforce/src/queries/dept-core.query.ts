import type { Department, Member, PrismaClient } from "@prisma/client/workforce/index.js";
import { MemberPosition } from "@prisma/client/workforce/index.js";
import type { IQuery, IQueryHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";


export class DeptCoreQuery implements IQuery<{ department: Department }, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: { department: Department },
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IQueryHandler<DeptCoreQuery, Member> = async ( { data, context } ) => {
		return context.prisma.member.findFirstOrThrow( {
			where: { department: data.department, position: MemberPosition.CORE }
		} );
	};
}
