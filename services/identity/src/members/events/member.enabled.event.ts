import type { IEvent, IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs";
import { MailService } from "@shaastra/mail";
import type { Member, User } from "@prisma/client/identity";

export class MemberEnabledEvent implements IEvent {
	constructor( public readonly data: Member & { user: User } ) {}
}

@EventsHandler( MemberEnabledEvent )
export class MemberEnabledEventHandler implements IEventHandler<MemberEnabledEvent> {
	constructor( private readonly mailService: MailService ) {}

	async handle( { data }: MemberEnabledEvent ) {
		const subject = `Your Shaastra Prime Account is Enabled`;
		const content = `Hi ${ data.user.name }, You can now use Shaastra Prime.`;
		await this.mailService.sendMail( { subject, content, email: data.user.email, name: data.user.name } );
	}
}