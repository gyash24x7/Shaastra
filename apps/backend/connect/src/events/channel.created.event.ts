import { LoggerFactory } from "@app/framework/logger";
import { RedisClient } from "@app/framework/redis";
import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import type { Channel } from "@prisma/client/connect";
import { OutboundEvents } from "../constants";

export class ChannelCreatedEvent implements IEvent {
	constructor( public readonly data: Channel ) {}
}

@EventsHandler( ChannelCreatedEvent )
export class ChannelCreatedEventHandler implements IEventHandler<ChannelCreatedEvent> {
	private readonly logger = LoggerFactory.getLogger( ChannelCreatedEventHandler );

	constructor( @RedisClient() private readonly redisClient: ClientProxy ) {}

	async handle( { data }: ChannelCreatedEvent ) {
		this.logger.debug( ">> handle()" );
		this.logger.debug( "Data: %o", data );

		this.redisClient.emit( OutboundEvents.CHANNEL_CREATED, data );
	}
}