import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { CommandBus, EventsHandler } from "@nestjs/cqrs";
import { MailService } from "@shaastra/mail";
import type { Token, User } from "@prisma/client/identity";
import { CreateTokenCommand } from "../../tokens/commands/create.token.command";

export class UserCreatedEvent implements IEvent {
	constructor( public readonly data: User ) {}
}

@EventsHandler( UserCreatedEvent )
export class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
	constructor(
		private readonly mailService: MailService,
		private readonly commandBus: CommandBus
	) {}

	async handle( { data }: UserCreatedEvent ) {
		const token: Token = await this.commandBus.execute( new CreateTokenCommand( { userId: data.id } ) );
		const link = `http://localhost:3000/verify/${ data.id }/${ token.id }`;
		const subject = "Verify your Shaastra Account";
		const content = `Please click here to verify your Shaastra Account ${ link }`;
		await this.mailService.sendMail( { subject, content, email: data.email, name: data.name } );
	}
}