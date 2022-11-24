import { CreateTokenCommandHandler } from "./create.token.command";
import { CreateUserCommandHandler } from "./create.user.command";
import { LoginCommandHandler } from "./login.command";
import { VerifyUserCommandHandler } from "./verify.user.command";

export default [
	CreateTokenCommandHandler,
	CreateUserCommandHandler,
	LoginCommandHandler,
	VerifyUserCommandHandler
];