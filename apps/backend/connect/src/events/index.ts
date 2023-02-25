import { ChannelCreatedEventHandler } from "./channel.created.event";
import { MessageCreatedEventHandler } from "./message.created.event";

export * from "./channel.created.event";
export * from "./message.created.event";

const eventHandlers = [ MessageCreatedEventHandler, ChannelCreatedEventHandler ];
export default eventHandlers;