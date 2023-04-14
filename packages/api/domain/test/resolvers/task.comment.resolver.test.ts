import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { TaskCommentResolver, TaskCommentService } from "@api/domain";
import type { Task } from "@prisma/client";

describe( "Task Comment Resolver", () => {

	const mockTaskCommentService = mockDeep<TaskCommentService>();
	const mockTask = mockDeep<Task>()

	it( "should return the task associated with the comment when task is called", async () => {
		mockTaskCommentService.getTask.mockResolvedValue( mockTask );
		const taskCommentResolver = new TaskCommentResolver( mockTaskCommentService );
		const task = await taskCommentResolver.task( { id: "some_task_comment_id" } );

		expect( task ).toBe( mockTask );
		expect( mockTaskCommentService.getTask ).toHaveBeenCalledWith( "some_task_comment_id" );
	} )
} )