import type { ICommand } from "@nestjs/cqrs";
import type { CreateMemberInput } from "./member.inputs";

export class CreateMemberCommand implements ICommand {
	constructor( public readonly data: CreateMemberInput ) {}
}

export class EnableMemberCommand implements ICommand {
	constructor( public readonly memberId: string ) {}
}