import type { IQuery } from "@nestjs/cqrs";
import type { GetMembersInput } from "./member.inputs";

export class GetMembersQuery implements IQuery {
	constructor( public readonly data: GetMembersInput ) {}
}

export class GetMemberQuery implements IQuery {
	constructor( public readonly id: string ) {}
}