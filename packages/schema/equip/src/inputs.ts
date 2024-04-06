import { builder, Inputs } from "./builder.ts";

builder.inputType( Inputs.CreateTaskInput, {
	fields: ( t ) => {
		return {
			title: t.string( { required: true } ),
			description: t.string( { required: true } ),
			deadline: t.string( { required: true } ),
			forDepartment: t.string( { required: true } )
		};
	}
} );

builder.inputType( Inputs.UpdateTaskInput, {
	fields: ( t ) => {
		return {
			taskId: t.string( { required: true } ),
			title: t.string( { required: true } ),
			description: t.string( { required: true } ),
			deadline: t.string( { required: true } )
		};
	}
} );

builder.inputType( Inputs.TaskIdInput, {
	fields: ( t ) => {
		return {
			taskId: t.string( { required: true } )
		};
	}
} );

builder.inputType( Inputs.AddTaskCommentInput, {
	fields: ( t ) => {
		return {
			taskId: t.string( { required: true } ),
			content: t.string( { required: true } )
		};
	}
} );

builder.inputType( Inputs.AssignTaskInput, {
	fields: ( t ) => {
		return {
			taskId: t.string( { required: true } ),
			assigneeId: t.string( { required: true } )
		};
	}
} );
