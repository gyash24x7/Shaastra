import { CreateTokenCommandHandler } from "./create.token.command.js";
import { CreateUserCommandHandler } from "./create.user.command.js";
import { LoginCommandHandler } from "./login.command.js";
import { VerifyUserCommandHandler } from "./verify.user.command.js";

export default [
	CreateTokenCommandHandler,
	CreateUserCommandHandler,
	LoginCommandHandler,
	VerifyUserCommandHandler
];