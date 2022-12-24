import { AppEvents } from "../events/index.js";
import type { CreateTeamInput } from "../graphql/inputs.js";
import { TeamMessages } from "../messages/team.messages.js";
import type { AppContext } from "../index.js";

export default async function createTeamCommandHandler( _data: unknown, context: AppContext ) {
	const data = _data as CreateTeamInput;
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

	context.eventBus.execute( AppEvents.TEAM_CREATED_EVENT, team, context );
	return team.id;
}