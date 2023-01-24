import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import type { Message } from "@prisma/client/connect/index.js";
import { LoggerFactory, RedisClient } from "@shaastra/framework";
import { OutboundEvents } from "../constants/outbound.events.js";

export class MessageCreatedEvent implements IEvent {
	constructor( public readonly data: Message ) {}
}

@EventsHandler( MessageCreatedEvent )
export class MessageCreatedEventHandler implements IEventHandler<MessageCreatedEvent> {
	private readonly logger = LoggerFactory.getLogger( MessageCreatedEventHandler );

	constructor( @RedisClient() private readonly redisClient: ClientProxy ) {}

	async handle( { data }: MessageCreatedEvent ) {
		this.logger.debug( ">> handle()" );
		this.logger.debug( "Data: %o", data );

		this.redisClient.emit( OutboundEvents.MESSAGE_CREATED, data );
	}
}
