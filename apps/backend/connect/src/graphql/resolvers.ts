import { CreateChannelCommand, CreateMessageCommand } from "../commands/index.js";
import { ChannelQuery, MessageQuery, MessagesQuery } from "../queries/index.js";
import type { Resolvers } from "./generated/index.js";

export const resolvers: Resolvers = {
	Query: {
		getMessages( _parent, { data }, context ) {
			return context.queryBus.execute( new MessagesQuery( { channelId: data.channelId }, context ) );
		}
	},
	Mutation: {
		async createChannel( _parent, { data }, context ) {
			return context.commandBus.execute( new CreateChannelCommand( data, context ) );
		},

		async createMessage( _parent, { data }, context ) {
			return context.commandBus.execute( new CreateMessageCommand( data, context ) );
		}
	},
	Channel: {
		__resolveReference( parent, context ) {
			return context.queryBus.execute( new ChannelQuery( { id: parent.id }, context ) );
		},

		async messages( parent, _args, context ) {
			return context.queryBus.execute( new MessagesQuery( { channelId: parent.id }, context ) );
		}
	},
	Message: {
		__resolveReference( parent, context ) {
			return context.queryBus.execute( new MessageQuery( { id: parent.id }, context ) );
		},

		async channel( parent, _args, context ) {
			return context.queryBus.execute( new ChannelQuery( { id: parent.channelId }, context ) );
		}
	}
};