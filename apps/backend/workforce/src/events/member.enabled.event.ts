import type { Member, PrismaClient } from "@prisma/client/workforce/index.js";
import type { IEvent, IEventHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";


export class MemberEnabledEvent implements IEvent<Member, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: Member,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IEventHandler<MemberEnabledEvent> = async ( { data, context } ) => {
		const subject = `Your Shaastra Prime Account is Enabled`;
		const content = `Hi ${ data.name }, You can now use Shaastra Prime.`;
		await context.mailer.sendMail( { subject, content, email: data.email, name: data.name } );
	};
}