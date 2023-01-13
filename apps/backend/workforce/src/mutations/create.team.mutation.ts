import type { Department } from "@prisma/client/workforce/index.js";
import { TeamMessages } from "../constants/messages.js";
import { AppEvents } from "../events/index.js";
import type { MutationResolvers } from "../graphql/generated/index.js";

export const createTeamMutationResolver: MutationResolvers["createTeam"] =
	async function ( _parent, { data }, context, _info ) {
		context.logger.trace( `>> Resolvers::Mutation::createTeam()` );
		context.logger.debug( "Data: %o", data );

		const existingTeam = await context.prisma.team.findUnique( { where: { name: data.name } } );

		if ( existingTeam ) {
			context.logger.debug( `Team already exists with Name ${ data.name }` );
			throw new Error( TeamMessages.ALREADY_EXISTS );
		}

		const team = await context.prisma.team.create( {
			data: {
				...data,
				department: context.authInfo?.department! as Department,
				members: { connect: { id: context.authInfo!.id } },
				createdBy: { connect: { id: context.authInfo!.id } }
			},
			include: {
				members: true
			}
		} );

		context.logger.debug( `Team Created Successfully! ${ team.id }` );
		context.eventBus.execute( AppEvents.TEAM_CREATED_EVENT, team, context );
		return team;
	};