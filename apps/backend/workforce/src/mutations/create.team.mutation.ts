import { AppEvents } from "../events/index.js";
import { TeamMessages } from "../messages/team.messages.js";
import { eventBus, logger } from "../index.js";
import { prisma } from "../prisma/index.js";
import { builder } from "../schema/builder.js";
import { teamRef } from "../entities/index.js";
import type { Department } from "@prisma/client/workforce/index.js";

const createTeamInputRef = builder.inputType( "CreateTeamInput", {
	fields: t => ( {
		name: t.string( { required: true } )
	} )
} );

builder.mutationField( "createTeam", t => t.prismaField( {
	type: teamRef,
	args: { data: t.arg( { type: createTeamInputRef, required: true } ) },
	async resolve( _query, _parent, { data }, context, _info ) {
		logger.trace( `>> Resolvers::Mutation::createTeam()` );
		logger.debug( "Data: %o", data );

		const existingTeam = await prisma.team.findUnique( { where: { name: data.name } } );

		if ( existingTeam ) {
			logger.debug( `Team already exists with Name ${ data.name }` );
			throw new Error( TeamMessages.ALREADY_EXISTS );
		}

		const team = await prisma.team.create( {
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

		logger.debug( `Team Created Successfully! ${ team.id }` );
		eventBus.execute( AppEvents.TEAM_CREATED_EVENT, team, context );
		return team;
	}
} ) );