import type { PrismaClient, User } from "@prisma/client/identity/index.js";
import type { IQuery, IQueryHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";


export class UserQuery implements IQuery<{ id: string }, ServiceContext<PrismaClient>> {

	constructor(
		public readonly data: { id: string },
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IQueryHandler<UserQuery, User | null> = async ( { data, context } ) => {
		return context.prisma.user.findUnique( { where: { id: data.id } } );
	};
}
