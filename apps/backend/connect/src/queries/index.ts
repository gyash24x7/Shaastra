import type { PrismaClient } from "@prisma/client/connect/index.js";
import type { IQueries } from "@shaastra/framework";
import channelQueryHandler from "./channel.query.js";
import messagesQueryHandler from "./messages.query.js";

export * from "./channel.query.js";
export * from "./message.query.js";
export * from "./messages.query.js";

export enum AppQueries {
	CHANNEL_QUERY = "CHANNEL_QUERY",
	MESSAGE_QUERY = "MESSAGE_QUERY",
	MESSAGES_QUERY = "MESSAGES_QUERY"
}

const queries: IQueries<PrismaClient, AppQueries> = {
	CHANNEL_QUERY: channelQueryHandler,
	MESSAGE_QUERY: messagesQueryHandler,
	MESSAGES_QUERY: messagesQueryHandler
};

export default queries;