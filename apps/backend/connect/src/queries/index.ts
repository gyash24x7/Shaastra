import { ChannelQueryHandler } from "./channel.query.js";
import { MessageQueryHandler } from "./message.query.js";
import { MessagesQueryHandler } from "./messages.query.js";

export * from "./channel.query.js";
export * from "./message.query.js";
export * from "./messages.query.js";

const queryHandlers = [ MessagesQueryHandler, MessageQueryHandler, ChannelQueryHandler ];
export default queryHandlers;