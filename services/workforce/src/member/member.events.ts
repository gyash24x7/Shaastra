import type { IEvent } from "@nestjs/cqrs";
import type { MemberModel } from "./member.model";

export class MemberCreatedEvent implements IEvent {
	constructor( public readonly data: MemberModel ) {}
}

export class MemberEnabledEvent implements IEvent {
	constructor( public readonly data: MemberModel ) {}
}