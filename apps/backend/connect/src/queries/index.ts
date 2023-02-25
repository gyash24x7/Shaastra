import { ChannelQueryHandler } from "./channel.query";
import { MessageQueryHandler } from "./message.query";
import { MessagesQueryHandler } from "./messages.query";

export * from "./channel.query";
export * from "./message.query";
export * from "./messages.query";

const queryHandlers = [ MessagesQueryHandler, MessageQueryHandler, ChannelQueryHandler ];
export default queryHandlers;