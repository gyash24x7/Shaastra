import type { ICommands } from "@shaastra/framework";
import createChannelCommandHandler from "./create.channel.command.js";
import createMessageCommandHandler from "./create.message.command.js";

export * from "./create.channel.command.js";
export * from "./create.message.command.js";

export enum AppCommands {
	CREATE_CHANNEL_COMMAND = "CREATE_CHANNEL_COMMAND",
	CREATE_MESSAGE_COMMAND = "CREATE_MESSAGE_COMMAND"
}

const commands: ICommands<AppCommands> = {
	CREATE_CHANNEL_COMMAND: createChannelCommandHandler,
	CREATE_MESSAGE_COMMAND: createMessageCommandHandler
};

export default commands;