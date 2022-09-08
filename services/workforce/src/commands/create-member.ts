import type { CreateMemberInput } from "../inputs/create-member";
import type { ICommand } from "@nestjs/cqrs";

export class CreateMemberCommand implements ICommand {
	constructor( public readonly data: CreateMemberInput ) {}
}