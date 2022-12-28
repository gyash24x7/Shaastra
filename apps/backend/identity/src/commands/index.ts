import createTokenCommandHandler from "./create.token.command.js";
import createUserCommandHandler from "./create.user.command.js";
import loginCommandHandler from "./login.command.js";
import verifyUserCommandHandler from "./verify.user.command.js";
import type { ICommands } from "@shaastra/framework";

export * from "./create.token.command.js";
export * from "./login.command.js";
export * from "./create.user.command.js";
export * from "./verify.user.command.js";

export enum AppCommands {
	CREATE_TOKEN_COMMAND = "CREATE_TOKEN_COMMAND",
	CREATE_USER_COMMAND = "CREATE_USER_COMMAND",
	VERIFY_USER_COMMAND = "VERIFY_USER_COMMAND",
	LOGIN_COMMAND = "LOGIN_COMMAND"
}

const commands: ICommands<AppCommands> = {
	CREATE_TOKEN_COMMAND: createTokenCommandHandler,
	CREATE_USER_COMMAND: createUserCommandHandler,
	VERIFY_USER_COMMAND: verifyUserCommandHandler,
	LOGIN_COMMAND: loginCommandHandler
};

export default commands;