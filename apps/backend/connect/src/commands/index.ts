import { CreateChannelCommandHandler } from "./create.channel.command.js";
import { CreateMessageCommandHandler } from "./create.message.command.js";

export * from "./create.channel.command.js";
export * from "./create.message.command.js";

const commandHandlers = [ CreateMessageCommandHandler, CreateChannelCommandHandler ];
export default commandHandlers;