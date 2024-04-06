import { equipService } from "@equip/core";
import { builder, ExternalTypes, ObjectTypes } from "./builder.ts";

const memberRef = builder.externalRef( ExternalTypes.Member, builder.selection<{ id: string }>( "id" ) );
memberRef.implement( {
	externalFields: t => {
		return { id: t.id() };
	},
	fields: t => {
		return {
			tasksAssigned: t.prismaField( {
				type: [ taskRef ],
				resolve: ( _query, parent ) => equipService.getTasksAssigned( parent.id )
			} ),
			tasksCreated: t.prismaField( {
				type: [ taskRef ],
				resolve: ( _query, parent ) => equipService.getTasksCreated( parent.id )
			} )
		};
	}
} );

const taskRef = builder.prismaObject( ObjectTypes.Task, {
	fields: ( t ) => {
		return {
			id: t.exposeID( "id" ),
			title: t.exposeString( "title" ),
			description: t.exposeString( "description" ),
			status: t.exposeString( "status" ),
			byDepartment: t.exposeString( "byDepartment" ),
			forDepartment: t.exposeString( "forDepartment" ),
			deadline: t.expose( "deadline", { type: "DateTime" } ),
			createdAt: t.expose( "createdAt", { type: "DateTime" } ),
			activity: t.relation( "activity" ),
			comments: t.relation( "comments" ),
			assignee: t.field( {
				type: memberRef,
				nullable: true,
				resolve: ( task ) => {
					return !task.assigneeId ? null : { id: task.assigneeId };
				}
			} ),
			createdBy: t.field( {
				type: memberRef,
				resolve: ( task ) => {
					return { id: task.createdBy };
				}
			} )
		};
	}
} );

builder.asEntity( taskRef, {
	key: builder.selection<{ id: string }>( "id" ),
	resolveReference: ( { id } ) => equipService.getTask( id )
} );

const taskActivityRef = builder.prismaObject( ObjectTypes.TaskActivity, {
	fields: ( t ) => {
		return {
			id: t.exposeID( "id" ),
			title: t.exposeString( "title" ),
			description: t.exposeString( "description" ),
			type: t.exposeString( "type" ),
			createdAt: t.expose( "createdAt", { type: "DateTime" } ),
			task: t.relation( "task" )
		};
	}
} );

builder.asEntity( taskActivityRef, {
	key: builder.selection<{ id: string }>( "id" ),
	resolveReference: ( { id } ) => equipService.getTaskActivity( id )
} );

const taskCommentRef = builder.prismaObject( ObjectTypes.TaskComment, {
	fields: ( t ) => {
		return {
			id: t.exposeID( "id" ),
			content: t.exposeString( "content" ),
			createdAt: t.expose( "createdAt", { type: "DateTime" } ),
			task: t.relation( "task" ),
			createdBy: t.field( {
				type: memberRef,
				resolve: ( comment ) => {
					return { id: comment.createdBy };
				}
			} )
		};
	}
} );

builder.asEntity( taskCommentRef, {
	key: builder.selection<{ id: string }>( "id" ),
	resolveReference: ( { id } ) => equipService.getTaskComment( id )
} );
