import { builder, Inputs } from "./builder.ts";

builder.inputType( Inputs.CreateMemberInput, {
	fields: t => {
		return {
			id: t.string( { required: true } ),
			name: t.string( { required: true } ),
			email: t.string( { required: true } ),
			rollNumber: t.string( { required: true } ),
			department: t.string( { required: true } ),
			mobile: t.string( { required: true } )
		};
	}
} );

builder.inputType( Inputs.EnableMemberInput, {
	fields: t => {
		return {
			id: t.string( { required: true } )
		};
	}
} );

builder.inputType( Inputs.CreateTeamInput, {
	fields: t => {
		return {
			name: t.string( { required: true } ),
			department: t.string( { required: true } )
		};
	}
} );

builder.inputType( Inputs.AddMembersInput, {
	fields: t => {
		return {
			teamId: t.string( { required: true } ),
			memberIds: t.stringList( { required: true } )
		};
	}
} );
