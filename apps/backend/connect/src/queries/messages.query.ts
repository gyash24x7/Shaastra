import type { QueryResolvers } from "../graphql/generated/index.js";

export const messagesQueryResolver: QueryResolvers["messages"] =
	async function ( _parent, { data }, context, _info ) {
		return context.prisma.channel.findUniqueOrThrow( { where: { id: data.channelId } } ).messages();
	};