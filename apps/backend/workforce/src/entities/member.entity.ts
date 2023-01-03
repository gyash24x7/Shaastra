import { Department, MemberPosition } from "@prisma/client/workforce/index.js";
import { logger } from "../index.js";
import { prisma } from "../prisma/index.js";
import { builder } from "../schema/builder.js";


export const memberRef = builder.prismaObject( "Member", {
	fields: t => ( {
		id: t.exposeID( "id" ),
		about: t.exposeString( "about" ),
		coverPic: t.exposeString( "coverPic" ),
		department: t.expose( "department", { type: Department } ),
		email: t.exposeString( "email" ),
		enabled: t.exposeBoolean( "enabled" ),
		mobile: t.exposeString( "mobile" ),
		name: t.exposeString( "name" ),
		position: t.expose( "position", { type: MemberPosition } ),
		profilePic: t.exposeString( "profilePic" ),
		rollNumber: t.exposeString( "rollNumber" ),
		upi: t.exposeString( "upi" ),
		teams: t.relation( "teams" )
	} )
} );

builder.asEntity( memberRef, {
	key: builder.selection<{ id: string }>( "id" ),
	resolveReference( parent ) {
		logger.trace( `>> Resolvers::Member::reference()` );
		return prisma.member.findUnique( { where: { id: parent.id } } );
	}
} );