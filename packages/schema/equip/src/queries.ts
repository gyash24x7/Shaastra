import { equipService } from "@equip/core";
import { builder, Inputs, ObjectTypes, Queries } from "./builder.ts";

builder.queryField( Queries.Tasks, t =>
	t.prismaField( {
		type: [ ObjectTypes.Task ],
		resolve: ( _root, _parent, _args, ctx ) => {
			return equipService.getTasks( ctx.authInfo, false );
		}
	} )
);

builder.queryField( Queries.TasksRequested, t =>
	t.prismaField( {
		type: [ ObjectTypes.Task ],
		resolve: ( _root, _parent, _args, ctx ) => {
			return equipService.getTasks( ctx.authInfo, true );
		}
	} )
);

builder.queryField( Queries.TaskActivity, t =>
	t.prismaField( {
		type: [ ObjectTypes.TaskActivity ],
		args: {
			data: t.arg( {
				type: Inputs.TaskIdInput,
				required: true
			} )
		},
		resolve: ( _root, _parent, { data } ) => {
			return equipService.getTaskActivityForTask( data.taskId );
		}
	} )
);

builder.queryField( Queries.TaskComments, t =>
	t.prismaField( {
		type: [ ObjectTypes.TaskComment ],
		args: {
			data: t.arg( {
				type: Inputs.TaskIdInput,
				required: true
			} )
		},
		resolve: ( _root, _parent, { data } ) => {
			return equipService.getTaskComments( data.taskId );
		}
	} )
);
