import { CreateUserCommandHandler } from "./user/create-user.command";
import { LoginCommandHandler } from "./user/login.command";

export const commandHandlers = [ CreateUserCommandHandler, LoginCommandHandler ];