import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs";
import type { UserModel } from "../../models/user.model";
import { MailService } from "@shaastra/mail";

export class UserCreatedEvent implements IEvent {
	constructor( public readonly user: UserModel ) {}
}

@EventsHandler( UserCreatedEvent )
export class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
	constructor( private readonly mailService: MailService ) {}

	handle( { user }: UserCreatedEvent ) {
		this.mailService.
	}
}