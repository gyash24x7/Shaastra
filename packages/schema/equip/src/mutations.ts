import { equipService } from "@equip/core";
import { builder, Inputs, Mutations, ObjectTypes } from "./builder.ts";

builder.mutationField( Mutations.CreateTask, t =>
	t.prismaField( {
		type: ObjectTypes.Task,
		args: {
			data: t.arg( {
				type: Inputs.CreateTaskInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, ctx ) => {
			return equipService.createTask( data, ctx.authInfo );
		}
	} )
);

builder.mutationField( Mutations.UpdateTask, t =>
	t.prismaField( {
		type: ObjectTypes.Task,
		args: {
			data: t.arg( {
				type: Inputs.UpdateTaskInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, ctx ) => {
			return equipService.updateTask( data, ctx.authInfo );
		}
	} )
);

builder.mutationField( Mutations.AssignTask, t =>
	t.prismaField( {
		type: ObjectTypes.Task,
		args: {
			data: t.arg( {
				type: Inputs.AssignTaskInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, ctx ) => {
			return equipService.assignTask( data, ctx.authInfo );
		}
	} )
);

builder.mutationField( Mutations.StartTaskProgress, t =>
	t.prismaField( {
		type: ObjectTypes.Task,
		args: {
			data: t.arg( {
				type: Inputs.TaskIdInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, ctx ) => {
			return equipService.startTaskProgress( data.taskId, ctx.authInfo );
		}
	} )
);

builder.mutationField( Mutations.SubmitTask, t =>
	t.prismaField( {
		type: ObjectTypes.Task,
		args: {
			data: t.arg( {
				type: Inputs.TaskIdInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, ctx ) => {
			return equipService.submitTask( data.taskId, ctx.authInfo );
		}
	} )
);

builder.mutationField( Mutations.ApproveTask, t =>
	t.prismaField( {
		type: ObjectTypes.Task,
		args: {
			data: t.arg( {
				type: Inputs.TaskIdInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, ctx ) => {
			return equipService.approveTask( data.taskId, ctx.authInfo );
		}
	} )
);

builder.mutationField( Mutations.CompleteTask, t =>
	t.prismaField( {
		type: ObjectTypes.Task,
		args: {
			data: t.arg( {
				type: Inputs.TaskIdInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, ctx ) => {
			return equipService.completeTask( data.taskId, ctx.authInfo );
		}
	} )
);

builder.mutationField( Mutations.AddTaskComment, t =>
	t.prismaField( {
		type: ObjectTypes.TaskComment,
		args: {
			data: t.arg( {
				type: Inputs.AddTaskCommentInput,
				required: true
			} )
		},
		resolve: ( _query, _parent, { data }, ctx ) => {
			return equipService.addTaskComment( data, ctx.authInfo );
		}
	} )
);
