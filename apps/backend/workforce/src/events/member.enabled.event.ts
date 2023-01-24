import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs";
import type { Member } from "@prisma/client/workforce/index.js";
import { LoggerFactory, RedisClient } from "@shaastra/framework";
import { ClientProxy } from "@nestjs/microservices";
import { OutboundEvents } from "../constants/outbound.events.js";

export class MemberEnabledEvent implements IEvent {
	constructor( public readonly data: Member ) {}
}

@EventsHandler( MemberEnabledEvent )
export class MemberEnabledEventHandler implements IEventHandler<MemberEnabledEvent> {
	private readonly logger = LoggerFactory.getLogger( MemberEnabledEventHandler );

	constructor( @RedisClient() private readonly redisClient: ClientProxy ) {}

	async handle( { data }: MemberEnabledEvent ) {
		this.logger.debug( ">> handle()" );
		this.logger.debug( "Data: %o", data );

		const subject = `Your Shaastra Prime Account is Enabled`;
		const content = `Hi ${ data.name }, You can now use Shaastra Prime.`;
		this.logger.debug( `Need to send mail here!` );
		this.logger.debug( `Subject: ${ subject }` );
		this.logger.debug( `Content: ${ content }` );

		this.redisClient.emit( OutboundEvents.MEMBER_ENABLED, data );
	}
}