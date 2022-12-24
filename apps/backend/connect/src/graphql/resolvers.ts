import type { Resolvers } from "./generated/index.js";
import { AppQueries } from "../queries/index.js";
import { AppCommands } from "../commands/index.js";

export const resolvers: Resolvers = {
	Query: {
		getMessages( _parent, { data }, context ) {
			return context.queryBus.execute( AppQueries.MESSAGES_QUERY, { channelId: data.channelId }, context );
		}
	},
	Mutation: {
		async createChannel( _parent, { data }, context ) {
			return context.commandBus.execute( AppCommands.CREATE_CHANNEL_COMMAND, data, context );
		},

		async createMessage( _parent, { data }, context ) {
			return context.commandBus.execute( AppCommands.CREATE_MESSAGE_COMMAND, data, context );
		}
	},
	Channel: {
		__resolveReference( parent, context ) {
			return context.queryBus.execute( AppQueries.CHANNEL_QUERY, { id: parent.id }, context );
		},

		async messages( parent, _args, context ) {
			return context.queryBus.execute( AppQueries.MESSAGES_QUERY, { channelId: parent.id }, context );
		}
	},
	Message: {
		__resolveReference( parent, context ) {
			return context.queryBus.execute( AppQueries.MESSAGE_QUERY, { id: parent.id }, context );
		},

		async channel( parent, _args, context ) {
			return context.queryBus.execute( AppQueries.CHANNEL_QUERY, { id: parent.channelId }, context );
		}
	}
};