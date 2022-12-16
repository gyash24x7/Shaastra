import type { Message, PrismaClient } from "@prisma/client/connect/index.js";
import type { IQuery, IQueryHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";

export class MessageQuery implements IQuery<{ id: string }, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: { id: string },
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IQueryHandler<MessageQuery, Message | null> = async ( { data, context } ) => {
		return context.prisma.message.findUnique( { where: { id: data.id } } );
	};
}