import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs";
import { MailService } from "@shaastra/mail";
import type { Member, Team } from "../prisma/index.js";

export type TeamWithMembers = Team & { members: Member[] };

export class TeamCreatedEvent implements IEvent {
	constructor( public readonly data: TeamWithMembers ) {}
}

@EventsHandler( TeamCreatedEvent )
export class TeamCreatedEventHandler implements IEventHandler<TeamCreatedEvent> {
	constructor( private readonly mailService: MailService ) {}

	async handle( { data }: TeamCreatedEvent ) {
		const subject = `Welcome to ${ data.name } Team`;
		const content = `You have been added to a new team under ${ data.department }`;
		await Promise.all( data.members.map( member => {
			return this.mailService.sendMail( { subject, content, email: member.email, name: member.name } );
		} ) );
	}
}