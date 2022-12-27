import { AppEvents } from "../events/index.js";
import type { CreateTeamInput } from "../graphql/inputs.js";
import { TeamMessages } from "../messages/team.messages.js";
import type { AppContext } from "../index.js";
import { logger } from "@shaastra/framework";
import { AppCommands } from "./index.js";

export default async function createTeamCommandHandler( _data: unknown, context: AppContext ) {
	const data = _data as CreateTeamInput;

	logger.debug( `Handling ${ AppCommands.CREATE_TEAM_COMMAND }...` );
	logger.debug( "Data: ", data );

	const existingTeam = await context.prisma.team.findUnique( { where: { name: data.name } } );

	if ( existingTeam ) {
		logger.debug( `Team already exists with Name ${ data.name }` );
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

	logger.debug( `Team Created Successfully! ${ team.id }` );
	context.eventBus.execute( AppEvents.TEAM_CREATED_EVENT, team, context );
	return team.id;
}