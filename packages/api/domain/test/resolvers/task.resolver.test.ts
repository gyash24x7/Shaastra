import { TaskResolver, TaskService } from "@api/domain";
import type { Member, TaskActivity } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";

describe( "Task Resolver", () => {

	const mockTaskService = mockDeep<TaskService>();
	const mockMember = mockDeep<Member>();
	const mockTaskActivity = mockDeep<TaskActivity>();

	it( "should return the task creator when createdBy is called", async () => {
		mockTaskService.getTaskCreator.mockResolvedValue( mockMember );
		const taskResolver = new TaskResolver( mockTaskService );
		const taskCreator = await taskResolver.createdBy( { id: "some_id" } );

		expect( taskCreator ).toBe( mockMember );
		expect( mockTaskService.getTaskCreator ).toHaveBeenCalledWith( "some_id" );
	} );

	it( "should return the task assignee when assignee is called", async () => {
		mockTaskService.getTaskAssignee.mockResolvedValue( mockMember );
		const taskResolver = new TaskResolver( mockTaskService );
		const assignee = await taskResolver.assignee( { id: "some_id" } );

		expect( assignee ).toBe( mockMember );
		expect( mockTaskService.getTaskAssignee ).toHaveBeenCalledWith( "some_id" );
	} );

	it( "should return the task activity when taskActivity is called", async () => {
		mockTaskService.getTaskActivity.mockResolvedValue( [ mockTaskActivity ] );
		const taskResolver = new TaskResolver( mockTaskService );
		const taskActivity = await taskResolver.taskActivity( { id: "some_id" } );

		expect( taskActivity.length ).toBe( 1 );
		expect( taskActivity[ 0 ] ).toBe( mockTaskActivity );
		expect( mockTaskService.getTaskActivity ).toHaveBeenCalledWith( "some_id" );
	} );

	afterEach( () => {
		mockClear( mockTaskService );
	} );
} );