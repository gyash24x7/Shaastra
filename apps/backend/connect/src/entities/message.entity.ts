import { builder } from "../schema/builder.js";
import { logger } from "../index.js";
import { prisma } from "../prisma/index.js";
import { dateRef } from "../schema/scalars.js";



export const messageRef = builder.prismaObject( "Message", {
	fields: t => ( {
		id: t.exposeID( "id" ),
		content: t.exposeString( "content" ),
		createdOn: t.expose( "createdOn", { type: dateRef } ),
		channel: t.relation( "channel" )
	} )
} );

builder.asEntity( messageRef, {
	key: builder.selection<{ id: string }>( "id" ),
	resolveReference( parent ) {
		logger.trace( `>> Resolvers::Member::reference()` );
		return prisma.message.findUnique( { where: { id: parent.id } } );
	}
} );