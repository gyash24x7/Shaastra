import { CommandBus } from "@shaastra/cqrs";
import { CreateChannelCommand } from "./create.channel.command.js";
import { CreateMessageCommand } from "./create.message.command.js";

const commandBus = new CommandBus();
commandBus.registerCommand( CreateChannelCommand );
commandBus.registerCommand( CreateMessageCommand );

export { commandBus };

export * from "./create.channel.command.js";
export * from "./create.message.command.js";