import { workforceService } from "@workforce/core";
import { builder, Inputs, Mutations, ObjectTypes } from "./builder.ts";

builder.mutationField( Mutations.CreateMember, t =>
	t.prismaField( {
		type: ObjectTypes.Member,
		args: {
			data: t.arg( {
				type: Inputs.CreateMemberInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data } ) => {
			return workforceService.createMember( data );
		}
	} )
);

builder.mutationField( Mutations.EnableMember, t =>
	t.prismaField( {
		type: ObjectTypes.Member,
		args: {
			data: t.arg( {
				type: Inputs.EnableMemberInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, { authInfo } ) => {
			return workforceService.enableMember( data, authInfo );
		}
	} )
);

builder.mutationField( Mutations.CreateTeam, t =>
	t.prismaField( {
		type: ObjectTypes.Team,
		args: {
			data: t.arg( {
				type: Inputs.CreateTeamInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, { authInfo } ) => {
			return workforceService.createTeam( data, authInfo );
		}
	} )
);

builder.mutationField( Mutations.AddMembers, t =>
	t.prismaField( {
		type: ObjectTypes.Team,
		args: {
			data: t.arg( {
				type: Inputs.AddMembersInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, { authInfo } ) => {
			return workforceService.addMembers( data, authInfo );
		}
	} )
);
