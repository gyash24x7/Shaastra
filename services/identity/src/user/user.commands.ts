import type { ICommand } from "@nestjs/cqrs";
import type { LoginInput } from "./user.dtos";

export class LoginCommand implements ICommand {
	constructor( public readonly data: LoginInput ) {}
}