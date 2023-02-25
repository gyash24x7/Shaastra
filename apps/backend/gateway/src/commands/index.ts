import { CreateTokenCommandHandler } from "./create.token.command";
import { CreateUserCommandHandler } from "./create.user.command";
import { LoginCommandHandler } from "./login.command";
import { VerifyUserCommandHandler } from "./verify.user.command";

export * from "./create.token.command";
export * from "./create.user.command";
export * from "./login.command";
export * from "./verify.user.command";

const commandHandlers = [
	CreateTokenCommandHandler,
	CreateUserCommandHandler,
	LoginCommandHandler,
	VerifyUserCommandHandler
];
export default commandHandlers;