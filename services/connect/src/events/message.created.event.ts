import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs";
import type { Message } from "../prisma/index.js";

export class MessageCreatedEvent implements IEvent {
	constructor( public readonly data: Message ) {}
}

@EventsHandler( MessageCreatedEvent )
export class MessageCreatedEventHandler implements IEventHandler<MessageCreatedEvent> {
	constructor() {}

	async handle( { data }: MessageCreatedEvent ) {
		console.log( data );
		// Publish this message to websocket component
	}
}