import type { PrismaClient } from "@prisma/client/workforce/index.js";
import type { ICommand, ICommandHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import { MemberEnabledEvent } from "../events/index.js";
import type { EnableMemberInput } from "../graphql/inputs.js";


export class EnableMemberCommand implements ICommand<EnableMemberInput, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: EnableMemberInput,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: ICommandHandler<EnableMemberCommand, boolean> = async ( { data, context } ) => {
		const member = await context.prisma.member.update( {
			where: { id: data.id },
			data: { enabled: true }
		} );

		context.eventBus.publish( new MemberEnabledEvent( member, context ) );
		return true;
	};
}