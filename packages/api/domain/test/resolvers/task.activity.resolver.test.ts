import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { TaskActivityResolver, TaskActivityService } from "@api/domain";
import type { Task } from "@prisma/client";

describe( "Task Activity Resolver", () => {

	const mockTaskActivityService = mockDeep<TaskActivityService>();
	const mockTask = mockDeep<Task>()

	it( "should return the task associated with the activity when task is called", async () => {
		mockTaskActivityService.getTask.mockResolvedValue( mockTask );
		const taskActivityResolver = new TaskActivityResolver( mockTaskActivityService );
		const task = await taskActivityResolver.task( { id: "some_task_activity_id" } );

		expect( task ).toBe( mockTask );
		expect( mockTaskActivityService.getTask ).toHaveBeenCalledWith( "some_task_activity_id" );
	} )
} )