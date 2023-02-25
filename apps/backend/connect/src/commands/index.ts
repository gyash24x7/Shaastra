import { CreateChannelCommandHandler } from "./create.channel.command";
import { CreateMessageCommandHandler } from "./create.message.command";

export * from "./create.channel.command";
export * from "./create.message.command";

const commandHandlers = [ CreateMessageCommandHandler, CreateChannelCommandHandler ];
export default commandHandlers;