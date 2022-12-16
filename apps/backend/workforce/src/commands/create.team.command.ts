import type { PrismaClient } from "@prisma/client/workforce/index.js";
import type { ICommand, ICommandHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import { TeamCreatedEvent } from "../events/index.js";
import type { CreateTeamInput } from "../graphql/inputs.js";
import { TeamMessages } from "../messages/team.messages.js";


export class CreateTeamCommand implements ICommand<CreateTeamInput, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: CreateTeamInput,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: ICommandHandler<CreateTeamCommand, string> = async ( { data, context } ) => {
		const existingTeam = await context.prisma.team.findUnique( { where: { name: data.name } } );

		if ( existingTeam ) {
			throw new Error( TeamMessages.ALREADY_EXISTS );
		}

		const team = await context.prisma.team.create( {
			data: {
				...data,
				members: { connect: { id: context.authInfo!.id } },
				createdBy: { connect: { id: context.authInfo!.id } }
			},
			include: {
				members: true
			}
		} );
		context.eventBus.publish( new TeamCreatedEvent( team, context ) );
		return team.id;
	};
}