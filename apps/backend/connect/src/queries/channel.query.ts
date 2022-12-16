import type { Channel, PrismaClient } from "@prisma/client/connect/index.js";
import type { IQuery, IQueryHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";

export class ChannelQuery implements IQuery<{ id: string }, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: { id: string },
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IQueryHandler<ChannelQuery, Channel | null> = async ( { data, context } ) => {
		return context.prisma.channel.findUnique( { where: { id: data.id } } );
	};
}