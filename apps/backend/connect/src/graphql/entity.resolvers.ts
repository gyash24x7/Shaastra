import type { MessageResolvers, ChannelResolvers } from "./generated/index.js";

export const messageResolvers: MessageResolvers = {
	__resolveReference( { id }, context ) {
		return context.prisma.message.findUniqueOrThrow( { where: { id } } );
	},
	channel( { id }, _args, context ) {
		return context.prisma.channel.findUniqueOrThrow( { where: { id } } );
	}
};

export const channelResolvers: ChannelResolvers = {
	__resolveReference( { id }, context ) {
		return context.prisma.channel.findUniqueOrThrow( { where: { id } } );
	},
	messages( { id }, _args, context ) {
		return context.prisma.channel.findUniqueOrThrow( { where: { id } } ).messages();
	}
};