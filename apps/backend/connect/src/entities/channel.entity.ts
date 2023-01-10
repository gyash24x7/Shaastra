import { logger } from "..";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";
import { channelTypeRef, dateRef } from "../schema/scalars";

export const channelRef = builder.prismaObject( "Channel", {
	fields: t => (
		{
			id: t.exposeID( "id" ),
			name: t.exposeString( "name" ),
			description: t.exposeString( "description" ),
			messages: t.relation( "messages" ),
			type: t.expose( "type", { type: channelTypeRef } ),
			createdOn: t.expose( "createdOn", { type: dateRef } ),
			archived: t.exposeBoolean( "archived" )
		}
	)
} );

builder.asEntity( channelRef, {
	key: builder.selection<{ id: string }>( "id" ),
	resolveReference( parent ) {
		logger.trace( `>> Resolvers::Member::reference()` );
		return prisma.channel.findUnique( { where: { id: parent.id } } );
	}
} );