import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs";
import type { Member, Team } from "@prisma/client/workforce/index.js";
import { LoggerFactory, RedisClient } from "@shaastra/framework";
import { ClientProxy } from "@nestjs/microservices";
import { OutboundEvents } from "../constants/outbound.events.js";

export class TeamCreatedEvent implements IEvent {
	constructor( public readonly data: Team & { members: Member[] } ) {}
}

@EventsHandler( TeamCreatedEvent )
export class TeamCreatedEventHandler implements IEventHandler<TeamCreatedEvent> {
	private readonly logger = LoggerFactory.getLogger( TeamCreatedEventHandler );

	constructor( @RedisClient() private readonly redisClient: ClientProxy ) {}

	async handle( { data }: TeamCreatedEvent ) {
		this.logger.debug( ">> handle()" );
		this.logger.debug( "Data: %o", data );

		const subject = `Welcome to ${ data.name } Team`;
		const content = `You have been added to a new team under ${ data.department }`;

		await Promise.all( data.members.map( () => {
			this.logger.debug( `Need to send mail here!` );
			this.logger.debug( `Subject: ${ subject }` );
			this.logger.debug( `Content: ${ content }` );
		} ) );

		this.redisClient.emit( OutboundEvents.TEAM_CREATED, data );
	}
}
