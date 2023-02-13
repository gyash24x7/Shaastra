import { ChannelCreatedEventHandler } from "./channel.created.event.js";
import { MessageCreatedEventHandler } from "./message.created.event.js";

export * from "./channel.created.event.js";
export * from "./message.created.event.js";

const eventHandlers = [ MessageCreatedEventHandler, ChannelCreatedEventHandler ];
export default eventHandlers;