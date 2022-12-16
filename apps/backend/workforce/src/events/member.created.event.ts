import type { Member, PrismaClient } from "@prisma/client/workforce/index.js";
import type { IEvent, IEventHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import { DeptCoreQuery } from "../queries/index.js";


export class MemberCreatedEvent implements IEvent<Member, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: Member,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IEventHandler<MemberCreatedEvent> = async ( { data, context } ) => {
		const member: Member = await context.queryBus.execute(
			new DeptCoreQuery( { department: data.department }, context )
		);
		const subject = `New Member requested to join ${ data.department }`;
		const content = `Please log in to Shaastra Prime and approve this request.`;
		await context.mailer.sendMail( { subject, content, email: member.email, name: member.name } );
	};
}