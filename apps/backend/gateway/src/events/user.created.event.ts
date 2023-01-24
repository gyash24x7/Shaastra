import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { CommandBus, EventsHandler } from "@nestjs/cqrs";
import type { Token, User } from "@prisma/client/identity/index.js";
import { CreateTokenCommand } from "../commands/create.token.command.js";
import { LoggerFactory } from "@shaastra/framework";

export class UserCreatedEvent implements IEvent {
	constructor( public readonly data: User ) {}
}

@EventsHandler( UserCreatedEvent )
export class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
	private readonly logger = LoggerFactory.getLogger( UserCreatedEventHandler );

	constructor( private readonly commandBus: CommandBus ) {}

	async handle( { data }: UserCreatedEvent ) {
		this.logger.debug( ">> handle()" );
		this.logger.debug( "Data: %o", data );

		const token: Token = await this.commandBus.execute( new CreateTokenCommand( { userId: data.id } ) );
		const link = `http://localhost:9000/api/auth/verify-email/${ data.id }/${ token.hash }`;
		const subject = "Verify your Shaastra Account";
		const content = `Please click here to verify your Shaastra Account ${ link }`;

		this.logger.debug( `Need to send mail here!` );
		this.logger.debug( `Subject: ${ subject }` );
		this.logger.debug( `Content: ${ content }` );
	}
}