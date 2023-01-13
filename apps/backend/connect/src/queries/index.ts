import type { QueryResolvers } from "../graphql/generated/index.js";
import { channelsQueryResolver } from "./channels.query.js";
import { messagesQueryResolver } from "./messages.query.js";

export * from "./channels.query.js";
export * from "./messages.query.js";

export const queryResolvers: QueryResolvers = {
	channels: channelsQueryResolver,
	messages: messagesQueryResolver
};