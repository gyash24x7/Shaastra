import type { PrismaService } from "@api/common";
import { TaskService } from "@api/domain";
import type { Member, Prisma, Task, TaskActivity } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";

describe( "Task Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockPrismaTaskClient = mockDeep<Prisma.Prisma__TaskClient<Task>>();
	const mockMember = mockDeep<Member>();
	const mockTaskActivity = mockDeep<TaskActivity>();

	it( "should return the task creator when getTaskCreator is called", async () => {
		mockPrismaTaskClient.createdBy.mockResolvedValue( mockMember );
		mockPrismaService.task.findUniqueOrThrow.mockReturnValue( mockPrismaTaskClient );
		const taskService = new TaskService( mockPrismaService );
		const creator = await taskService.getTaskCreator( "some_id" );

		expect( creator ).toBe( mockMember );
		expect( mockPrismaService.task.findUniqueOrThrow ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
		expect( mockPrismaTaskClient.createdBy ).toHaveBeenCalled();
	} );

	it( "should return the task assignee when getTaskAssignee is called", async () => {
		mockPrismaTaskClient.assignee.mockResolvedValue( mockMember );
		mockPrismaService.task.findUniqueOrThrow.mockReturnValue( mockPrismaTaskClient );
		const taskService = new TaskService( mockPrismaService );
		const creator = await taskService.getTaskAssignee( "some_id" );

		expect( creator ).toBe( mockMember );
		expect( mockPrismaService.task.findUniqueOrThrow ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
		expect( mockPrismaTaskClient.assignee ).toHaveBeenCalled();
	} );

	it( "should return the task activity when getTaskActivity is called", async () => {
		mockPrismaTaskClient.taskActivity.mockResolvedValue( [ mockTaskActivity ] );
		mockPrismaService.task.findUniqueOrThrow.mockReturnValue( mockPrismaTaskClient );
		const taskService = new TaskService( mockPrismaService );
		const taskActivity = await taskService.getTaskActivity( "some_id" );

		expect( taskActivity.length ).toBe( 1 );
		expect( taskActivity[ 0 ] ).toBe( mockTaskActivity );
		expect( mockPrismaService.task.findUniqueOrThrow ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
		expect( mockPrismaTaskClient.taskActivity ).toHaveBeenCalled();
	} );

	afterEach( () => {
		mockClear( mockPrismaTaskClient );
		mockClear( mockPrismaService );
	} );
} );