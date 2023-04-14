import type { PrismaService } from "@api/common";
import { TaskActivityMessages, TaskActivityService } from "@api/domain";
import type { Task, TaskActivity } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { NotFoundException } from "@nestjs/common";

describe( "TaskActivity Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockTask = mockDeep<Task>();
	const mockTaskActivity = mockDeep<TaskActivity>();

	it( "should return the associated task when getTask is called", async () => {
		mockPrismaService.taskActivity.findUnique.mockResolvedValue( { ...mockTaskActivity, task: mockTask } as any );
		const taskActivityService = new TaskActivityService( mockPrismaService );
		const task = await taskActivityService.getTask( "some_task_activity_id" );

		expect( task ).toBe( mockTask );
		expect( mockPrismaService.taskActivity.findUnique ).toHaveBeenCalledWith( {
			where: { id: "some_task_activity_id" },
			include: { task: true }
		} );
	} );

	it( "should throw error when getTask is called and task activity is not found", async () => {
		mockPrismaService.taskActivity.findUnique.mockResolvedValue( null );
		const taskActivityService = new TaskActivityService( mockPrismaService );


		expect.assertions( 4 );
		return taskActivityService.getTask( "some_task_activity_id" )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TaskActivityMessages.NOT_FOUND );
				expect( mockPrismaService.taskActivity.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_task_activity_id" },
					include: { task: true }
				} )
			} )
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
	} );
} );