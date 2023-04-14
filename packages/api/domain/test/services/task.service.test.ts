import type { PrismaService, UserAuthInfo } from "@api/common";
import {
	AssignTaskInput,
	CreateTaskInput,
	TaskEvents,
	TaskIdInput,
	TaskMessages,
	TaskService,
	UpdateTaskInput
} from "@api/domain";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import type { Member, Prisma, Task, TaskActivity } from "@prisma/client";
import { TaskStatus } from "@prisma/client";
import dayjs from "dayjs";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { NotFoundException } from "@nestjs/common";

describe( "Task Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockPrismaTaskClient = mockDeep<Prisma.Prisma__TaskClient<Task>>();
	const mockEventEmitter = mockDeep<EventEmitter2>();
	const mockMember = mockDeep<Member>();
	const mockTaskActivity = mockDeep<TaskActivity>();
	const mockTask = mockDeep<Task>();
	const mockAuthInfo = mockDeep<UserAuthInfo>();

	it( "should return the task creator when getTaskCreator is called", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( { ...mockTask, createdBy: mockMember } as any );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const creator = await taskService.getTaskCreator( "some_id" );

		expect( creator ).toBe( mockMember );
		expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( {
			where: { id: "some_id" },
			include: { createdBy: true }
		} );
	} );

	it( "should throw error when getTaskCreator is called and task is not found", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( null );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return taskService.getTaskCreator( "some_id" )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TaskMessages.NOT_FOUND );
				expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_id" },
					include: { createdBy: true }
				} );
			} );
	} );

	it( "should return the task assignee when getTaskAssignee is called", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( { ...mockTask, assignee: mockMember } as any );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const assignee = await taskService.getTaskAssignee( "some_id" );

		expect( assignee ).toBe( mockMember );
		expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( {
			where: { id: "some_id" },
			include: { assignee: true }
		} );
	} );

	it( "should throw error when getTaskAssignee is called and task is not found", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( null );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return taskService.getTaskAssignee( "some_id" )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TaskMessages.NOT_FOUND );
				expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_id" },
					include: { assignee: true }
				} );
			} );
	} );

	it( "should return the task activity when getTaskActivity is called", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( {
			...mockTask,
			activity: [ mockTaskActivity ]
		} as any );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const activity = await taskService.getTaskActivity( "some_id" );

		expect( activity.length ).toBe( 1 );
		expect( activity[ 0 ] ).toBe( mockTaskActivity );
		expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( {
			where: { id: "some_id" },
			include: { activity: true }
		} );
	} );

	it( "should throw error when getTaskActivity is called and task is not found", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( null );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );

		expect.assertions( 4 );
		return taskService.getTaskActivity( "some_id" )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TaskMessages.NOT_FOUND );
				expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_id" },
					include: { activity: true }
				} );
			} );
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
		mockPrismaService.task.findUnique.mockResolvedValue( mockTask );
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: UpdateTaskInput = { description: "Changed Description", taskId: "some_task_id" };
		const updatedTask = await taskService.updateTask( data );

		expect( updatedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.UPDATED, mockTask );
		expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { description: "Changed Description" },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should throw error when updateTask is called and task is not found", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( null );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: UpdateTaskInput = { description: "Changed Description", taskId: "some_task_id" };

		expect.assertions( 4 );
		return taskService.updateTask( data )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TaskMessages.NOT_FOUND );
				expect( mockPrismaService.task.findUnique )
					.toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
			} );
	} );

	it( "should assign task when assignTask is called", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( mockTask );
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: AssignTaskInput = { assigneeId: "some_assignee_id", taskId: "some_task_id" };
		const assignedTask = await taskService.assignTask( data );

		expect( assignedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.ASSIGNED, mockTask );
		expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { status: TaskStatus.ASSIGNED, assigneeId: "some_assignee_id" },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should throw error when assignTask is called and task is not found", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( null );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: AssignTaskInput = { assigneeId: "some_assignee_id", taskId: "some_task_id" };

		expect.assertions( 4 );
		return taskService.assignTask( data )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TaskMessages.NOT_FOUND );
				expect( mockPrismaService.task.findUnique )
					.toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
			} );
	} );

	it( "should start task progress when startTaskProgress is called", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( mockTask );
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: TaskIdInput = { taskId: "some_task_id" };
		const updatedTask = await taskService.startTaskProgress( data );

		expect( updatedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.PROGRESS_STARTED, mockTask );
		expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { status: TaskStatus.IN_PROGRESS },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should submit task when submitTask is called", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( mockTask );
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: TaskIdInput = { taskId: "some_task_id" };
		const updatedTask = await taskService.submitTask( data );

		expect( updatedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.SUBMITTED, mockTask );
		expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { status: TaskStatus.SUBMITTED },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should approve task when approveTask is called", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( mockTask );
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: TaskIdInput = { taskId: "some_task_id" };
		const updatedTask = await taskService.approveTask( data );

		expect( updatedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.APPROVED, mockTask );
		expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { status: TaskStatus.APPROVED },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should complete task when completeTask is called", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( mockTask );
		mockPrismaService.task.update.mockResolvedValue( mockTask );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: TaskIdInput = { taskId: "some_task_id" };
		const updatedTask = await taskService.completeTask( data );

		expect( updatedTask ).toBe( mockTask );
		expect( mockEventEmitter.emit ).toHaveBeenCalledWith( TaskEvents.COMPLETED, mockTask );
		expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
		expect( mockPrismaService.task.update ).toHaveBeenCalledWith( {
			data: { status: TaskStatus.COMPLETED },
			where: { id: "some_task_id" }
		} );
	} );

	it( "should throw error when any status update method is called and task is not found", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( null );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const data: TaskIdInput = { taskId: "some_task_id" };

		expect.assertions( 4 );
		return taskService.approveTask( data )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TaskMessages.NOT_FOUND );
				expect( mockPrismaService.task.findUnique )
					.toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
			} );
	} );

	it( "should get tasks for the authenticated user when getTasks is called for task requests", async () => {
		mockPrismaService.task.findMany.mockResolvedValue( [ mockTask ] );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const mockAuthInfo: UserAuthInfo = { id: "some_id", department: "WEBOPS", position: "CORE" };
		const tasks = await taskService.getTasks( mockAuthInfo, true );

		expect( tasks.length ).toBe( 1 );
		expect( tasks[ 0 ] ).toBe( mockTask );
		expect( mockPrismaService.task.findMany ).toHaveBeenCalledWith( {
			where: { byDepartment: "WEBOPS" }
		} );
	} );

	it( "should get tasks for the authenticated user when getTasks is called for tasks received", async () => {
		mockPrismaService.task.findMany.mockResolvedValue( [ mockTask ] );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const mockAuthInfo: UserAuthInfo = { id: "some_id", department: "WEBOPS", position: "CORE" };
		const tasks = await taskService.getTasks( mockAuthInfo, false );

		expect( tasks.length ).toBe( 1 );
		expect( tasks[ 0 ] ).toBe( mockTask );
		expect( mockPrismaService.task.findMany ).toHaveBeenCalledWith( {
			where: { forDepartment: "WEBOPS" }
		} );
	} );

	it( "should get tasks for the authenticated user when getTasks is called for tasks received", async () => {
		mockPrismaService.task.findMany.mockResolvedValue( [ mockTask ] );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const mockAuthInfo: UserAuthInfo = { id: "some_id", department: "WEBOPS", position: "HEAD" };
		const tasks = await taskService.getTasks( mockAuthInfo, false );

		expect( tasks.length ).toBe( 1 );
		expect( tasks[ 0 ] ).toBe( mockTask );
		expect( mockPrismaService.task.findMany ).toHaveBeenCalledWith( {
			where: {
				forDepartment: "WEBOPS",
				assigneeId: "some_id"
			}
		} );
	} );

	it( "should get tasks for the authenticated user when getTasks is called for tasks requested", async () => {
		mockPrismaService.task.findMany.mockResolvedValue( [ mockTask ] );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const mockAuthInfo: UserAuthInfo = { id: "some_id", department: "WEBOPS", position: "COORD" };
		const tasks = await taskService.getTasks( mockAuthInfo, true );

		expect( tasks.length ).toBe( 1 );
		expect( tasks[ 0 ] ).toBe( mockTask );
		expect( mockPrismaService.task.findMany ).toHaveBeenCalledWith( {
			where: {
				byDepartment: "WEBOPS",
				assigneeId: "some_id"
			}
		} );
	} );

	it( "should get tasks for the authenticated user when getTasks is called for tasks requested", async () => {
		mockPrismaService.task.findMany.mockResolvedValue( [ mockTask ] );
		const taskService = new TaskService( mockPrismaService, mockEventEmitter );
		const mockAuthInfo: UserAuthInfo = { id: "some_id", department: "WEBOPS", position: "COCAS" };
		const tasks = await taskService.getTasks( mockAuthInfo, true );

		expect( tasks.length ).toBe( 1 );
		expect( tasks[ 0 ] ).toBe( mockTask );
		expect( mockPrismaService.task.findMany ).toHaveBeenCalledWith( { where: {} } );
	} );

	afterEach( () => {
		mockClear( mockPrismaTaskClient );
		mockClear( mockPrismaService );
		mockClear( mockEventEmitter );
	} );
} );