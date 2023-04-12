import type { PrismaService } from "@api/common";
import { TaskActivityService } from "@api/domain";
import type { Prisma, Task, TaskActivity } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";

describe( "TaskActivity Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockPrismaTaskActivityClient = mockDeep<Prisma.Prisma__TaskActivityClient<TaskActivity>>();
	const mockPrismaTaskClient = mockDeep<Prisma.Prisma__TaskClient<Task>>();
	const mockTask = mockDeep<Task>();
	const mockTaskActivity = mockDeep<TaskActivity>();

	it( "should return the associated task when getTask is called", async () => {
		mockPrismaTaskActivityClient.task.mockResolvedValue( mockTask );
		mockPrismaService.taskActivity.findUniqueOrThrow.mockReturnValue( mockPrismaTaskActivityClient );
		const taskActivityService = new TaskActivityService( mockPrismaService );
		const task = await taskActivityService.getTask( "some_task_activity_id" );

		expect( task ).toBe( mockTask );
		expect( mockPrismaService.taskActivity.findUniqueOrThrow )
			.toHaveBeenCalledWith( { where: { id: "some_task_activity_id" } } );
		expect( mockPrismaTaskActivityClient.task ).toHaveBeenCalled();
	} );

	it( "should return the task activity when getTaskActivity is called", async () => {
		mockPrismaTaskClient.taskActivity.mockResolvedValue( [ mockTaskActivity ] );
		mockPrismaService.task.findUniqueOrThrow.mockReturnValue( mockPrismaTaskClient );
		const taskActivityService = new TaskActivityService( mockPrismaService );
		const taskActivity = await taskActivityService.getTaskActivity( "some_task_id" );

		expect( taskActivity.length ).toBe( 1 );
		expect( taskActivity[ 0 ] ).toBe( mockTaskActivity );
		expect( mockPrismaService.task.findUniqueOrThrow )
			.toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
		expect( mockPrismaTaskClient.taskActivity ).toHaveBeenCalled();
	} );

	afterEach( () => {
		mockClear( mockPrismaTaskActivityClient );
		mockClear( mockPrismaService );
	} );
} );