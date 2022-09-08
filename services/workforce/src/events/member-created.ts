import type { IEvent } from "@nestjs/cqrs";
import type { MemberModel } from "../models/member.model";

export class MemberCreatedEvent implements IEvent {
	constructor( public readonly data: MemberModel ) {}
}