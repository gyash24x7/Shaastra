import { CommandBus } from "@shaastra/cqrs";
import { CreateTokenCommand } from "./create.token.command.js";
import { CreateUserCommand } from "./create.user.command.js";
import { LoginCommand } from "./login.command.js";
import { VerifyUserCommand } from "./verify.user.command.js";

const commandBus = new CommandBus();
commandBus.registerCommand( CreateTokenCommand );
commandBus.registerCommand( CreateUserCommand );
commandBus.registerCommand( LoginCommand );
commandBus.registerCommand( VerifyUserCommand );

export { commandBus };

export * from "./create.token.command.js";
export * from "./login.command.js";
export * from "./create.user.command.js";
export * from "./verify.user.command.js";
