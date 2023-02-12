import { CreateTokenCommandHandler } from "./create.token.command.js";
import { CreateUserCommandHandler } from "./create.user.command.js";
import { LoginCommandHandler } from "./login.command.js";
import { VerifyUserCommandHandler } from "./verify.user.command.js";

export * from "./create.token.command.js";
export * from "./create.user.command.js";
export * from "./login.command.js";
export * from "./verify.user.command.js";

const commandHandlers = [
	CreateTokenCommandHandler,
	CreateUserCommandHandler,
	LoginCommandHandler,
	VerifyUserCommandHandler
];
export default commandHandlers;