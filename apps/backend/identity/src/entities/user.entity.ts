import { logger } from "..";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";

export const userRef = builder.prismaObject( "User", {
	fields: t => (
		{
			id: t.exposeID( "id" ),
			name: t.exposeString( "name" ),
			email: t.exposeString( "email" ),
			username: t.exposeString( "username" ),
			verified: t.exposeBoolean( "verified" ),
			roles: t.exposeStringList( "roles" )
		}
	)
} );

builder.asEntity( userRef, {
	key: builder.selection<{ id: string }>( "id" ),
	resolveReference( parent ) {
		logger.trace( `>> Resolvers::Member::reference()` );
		return prisma.user.findUnique( { where: { id: parent.id } } );
	}
} );