import type { ICommand } from "@nestjs/cqrs";
import type { CreateUserInput, LoginInput } from "./user.dtos";

export class LoginCommand implements ICommand {
	constructor( public readonly data: LoginInput ) {}
}

export class CreateUserCommand implements ICommand {
	constructor( public readonly data: CreateUserInput ) {}
}