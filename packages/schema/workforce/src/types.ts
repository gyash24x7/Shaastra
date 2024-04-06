import { workforceService } from "@workforce/core";
import { builder, ObjectTypes } from "./builder.ts";

const memberRef = builder.prismaObject( ObjectTypes.Member, {
	fields: t => {
		return {
			id: t.exposeID( "id" ),
			name: t.exposeString( "name" ),
			email: t.exposeString( "email" ),
			rollNumber: t.exposeString( "rollNumber" ),
			department: t.exposeString( "department" ),
			position: t.exposeString( "position" ),
			profilePic: t.exposeString( "profilePic" ),
			coverPic: t.exposeString( "coverPic" ),
			mobile: t.exposeString( "mobile" ),
			upi: t.exposeString( "upi" ),
			about: t.exposeString( "about" ),
			teams: t.relation( "teams" )
		};
	}
} );

builder.asEntity( memberRef, {
	key: builder.selection<{ id: string }>( "id" ),
	resolveReference: async ( { id } ) => workforceService.getMember( id )
} );

const teamRef = builder.prismaObject( ObjectTypes.Team, {
	fields: t => {
		return {
			id: t.exposeID( "id" ),
			name: t.exposeString( "name" ),
			department: t.exposeString( "department" ),
			members: t.relation( "members" ),
			createdBy: t.relation( "createdBy" )
		};
	}
} );

builder.asEntity( teamRef, {
	key: builder.selection<{ id: string }>( "id" ),
	resolveReference: async ( { id } ) => workforceService.getTeam( id )
} );
