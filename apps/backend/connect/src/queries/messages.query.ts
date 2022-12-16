import type { Message, PrismaClient } from "@prisma/client/connect/index.js";
import type { IQuery, IQueryHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";

export class MessagesQuery implements IQuery<{ channelId: string }, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: { channelId: string },
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IQueryHandler<MessagesQuery, Message[]> = async ( { data, context } ) => {
		return context.prisma.channel.findUniqueOrThrow( { where: { id: data.channelId } } ).messages();
	};
}