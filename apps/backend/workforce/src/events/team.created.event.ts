import type { Member, PrismaClient, Team } from "@prisma/client/workforce/index.js";
import type { IEvent, IEventHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";


export class TeamCreatedEvent implements IEvent<Team & { members: Member[] }, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: Team & { members: Member[] },
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IEventHandler<TeamCreatedEvent> = async ( { data, context } ) => {
		const subject = `Welcome to ${ data.name } Team`;
		const content = `You have been added to a new team under ${ data.department }`;
		await Promise.all( data.members.map( team => {
			return context.mailer.sendMail( { subject, content, email: team.email, name: team.name } );
		} ) );
	};
}