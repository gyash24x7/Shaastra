import { Department } from "@prisma/client/workforce";
import { logger } from "..";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";

export const teamRef = builder.prismaObject( "Team", {
	fields: t => (
		{
			id: t.exposeID( "id" ),
			createdBy: t.relation( "createdBy" ),
			department: t.expose( "department", { type: Department } ),
			name: t.exposeString( "name" ),
			members: t.relation( "members" )
		}
	)
} );

builder.asEntity( teamRef, {
	key: builder.selection<{ id: string }>( "id" ),
	resolveReference( parent ) {
		logger.trace( `>> Resolvers::Team::reference()` );
		return prisma.team.findUnique( { where: { id: parent.id } } );
	}
} );