import type { PrismaService, UserAuthInfo } from "@api/common";
import { AssignTaskInput, CreateTaskInput, TaskEvents, TaskIdInput, TaskService, UpdateTaskInput } from "@api/domain";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import type { Member, Prisma, Task, TaskActivity } from "@prisma/client";
import { TaskStatus } from "@prisma/client";
import dayjs from "dayjs";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";

describe( "Task Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockPrismaTaskClient = mockDeep<Prisma.Prisma__TaskClient<Task>>();
	const mockEventEmitter = mockDeep<EventEmitter2>();
	const mockMember = mockDeep<Member>();
	const mockTaskActivity = mockDeep<TaskActivity>();
	const mockTask = mockDeep<Task>();
	const mockAuthInfo = mockDeep<UserAuthInfo>();

	it( "should return the task creator when getTaskCreator is called", async () => {
		mockPrismaTaskClient.createdBy.mockResolvedValue( mockMember );
		mockPrismaService.task.findUniqueOrThrow.mockReturnValue( mockPrismaTaskClient );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const creator = await taskService.getTaskCreator( "some_id" );

		expect( creator ).toBe( mockMember );
		expect( mockPrismaService.task.findUniqueOrThrow ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
		expect( mockPrismaTaskClient.createdBy ).toHaveBeenCalled();
	} );

	it( "should return the task assignee when getTaskAssignee is called", async () => {
		mockPrismaTaskClient.assignee.mockResolvedValue( mockMember );
		mockPrismaService.task.findUniqueOrThrow.mockReturnValue( mockPrismaTaskClient );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const creator = await taskService.getTaskAssignee( "some_id" );

		expect( creator ).toBe( mockMember );
		expect( mockPrismaService.task.findUniqueOrThrow ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
		expect( mockPrismaTaskClient.assignee ).toHaveBeenCalled();
	} );

	it( "should return the task activity when getTaskActivity is called", async () => {
		mockPrismaTaskClient.taskActivity.mockResolvedValue( [ mockTaskActivity ] );
		mockPrismaService.task.findUniqueOrThrow.mockReturnValue( mockPrismaTaskClient );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const taskActivity = await taskService.getTaskActivity( "some_id" );

		expect( taskActivity.length ).toBe( 1 );
		expect( taskActivity[ 0 ] ).toBe( mockTaskActivity );
		expect( mockPrismaService.task.findUniqueOrThrow ).toHaveBeenCalledWith( { where: { id: "some_id" } } );
		expect( mockPrismaTaskClient.taskActivity ).toHaveBeenCalled();
	} );

	it( "should create new task when createTask is called", async () => {
		mockPrismaService.task.create.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );

		mockAuthInfo.id = "some_member_id";
		mockAuthInfo.department = "WEBOPS";
		mockAuthInfo.position = "CORE";

		const data: CreateTaskInput = {
			title: "Task Title",
			deadline: dayjs().toString(),
			description: "Task Description",
			forDepartment: "CONCEPT_AND_DESIGN"
		};

		const newTask = await taskService.createTask( data, mockAuthInfo );

		expect( newTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.CREATED, mockTask );
		expect( mockPrismaService.task.create ).toHaveBeenCalledWith( {
			data: {
				...data,
				createdById: "some_member_id",
				byDepartment: "WEBOPS"
			}
		} );
	} );

	it( "should update task when updateTask is called", async () => {
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: UpdateTaskInput = { description: "Changed Description", taskId: "some_task_id" };
		const updatedTask = await taskService.updateTask( data );

		expect( updatedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.UPDATED, mockTask );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { description: "Changed Description" },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should assign task when assignTask is called", async () => {
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: AssignTaskInput = { assigneeId: "some_assignee_id", taskId: "some_task_id" };
		const assignedTask = await taskService.assignTask( data );

		expect( assignedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.ASSIGNED, mockTask );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { status: TaskStatus.ASSIGNED, assigneeId: "some_assignee_id" },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should start task progress when startTaskProgress is called", async () => {
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: TaskIdInput = { taskId: "some_task_id" };
		const updatedTask = await taskService.startTaskProgress( data );

		expect( updatedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.PROGRESS_STARTED, mockTask );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { status: TaskStatus.IN_PROGRESS },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should submit task when submitTask is called", async () => {
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: TaskIdInput = { taskId: "some_task_id" };
		const updatedTask = await taskService.submitTask( data );

		expect( updatedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.SUBMITTED, mockTask );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { status: TaskStatus.SUBMITTED },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should approve task when approveTask is called", async () => {
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: TaskIdInput = { taskId: "some_task_id" };
		const updatedTask = await taskService.approveTask( data );

		expect( updatedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.APPROVED, mockTask );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { status: TaskStatus.APPROVED },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should complete task when completeTask is called", async () => {
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: TaskIdInput = { taskId: "some_task_id" };
		const updatedTask = await taskService.completeTask( data );

		expect( updatedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.COMPLETED, mockTask );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { status: TaskStatus.COMPLETED },
			where: { id: "some_task_id" }
		} );
	} );

	afterEach( () => {
		mockClear( mockPrismaTaskClient );
		mockClear( mockPrismaService );
		mockClear( mockEventEmitter );
	} );
} );