import type { PrismaService, UserAuthInfo } from "@api/common";
import { AddTaskCommentInput, TaskCommentMessages, TaskCommentService, TaskMessages } from "@api/domain";
import type { Task, TaskComment } from "@prisma/client";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { NotFoundException } from "@nestjs/common";

describe( "TaskComment Service", () => {

	const mockPrismaService = mockDeep<PrismaService>();
	const mockTask = mockDeep<Task>();
	const mockTaskComment = mockDeep<TaskComment>();

	it( "should return the associated task when getTask is called", async () => {
		mockPrismaService.taskComment.findUnique.mockResolvedValue( { ...mockTaskComment, task: mockTask } as any );
		const taskCommentService = new TaskCommentService( mockPrismaService );
		const task = await taskCommentService.getTask( "some_task_comment_id" );

		expect( task ).toBe( mockTask );
		expect( mockPrismaService.taskComment.findUnique ).toHaveBeenCalledWith( {
			where: { id: "some_task_comment_id" },
			include: { task: true }
		} );
	} );

	it( "should throw error when getTask is called and task comment is not found", async () => {
		mockPrismaService.taskComment.findUnique.mockResolvedValue( null );
		const taskCommentService = new TaskCommentService( mockPrismaService );

		expect.assertions( 4 );
		return taskCommentService.getTask( "some_task_comment_id" )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TaskCommentMessages.NOT_FOUND );
				expect( mockPrismaService.taskComment.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_task_comment_id" },
					include: { task: true }
				} );
			} );
	} );

	it( "should add new comment to the task when addTaskComment is called", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( mockTask );
		mockPrismaService.taskComment.create.mockResolvedValue( mockTaskComment );
		const taskCommentService = new TaskCommentService( mockPrismaService );
		const data: AddTaskCommentInput = { taskId: "some_task_id", content: "comment content" };
		const mockAuthInfo: UserAuthInfo = { id: "some_member_id", department: "WEBOPS", position: "CORE" };
		const comment = await taskCommentService.addTaskComment( data, mockAuthInfo );

		expect( comment ).toBe( mockTaskComment );
		expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( { where: { id: "some_task_id" } } );
		expect( mockPrismaService.taskComment.create ).toHaveBeenCalledWith( {
			data: {
				content: "comment content",
				task: { connect: { id: "some_task_id" } },
				createdBy: { connect: { id: "some_member_id" } }
			}
		} );
	} );

	it( "should throw error when addTaskComment is called and task is not found", async () => {
		mockPrismaService.task.findUnique.mockResolvedValue( null );
		const taskCommentService = new TaskCommentService( mockPrismaService );
		const data: AddTaskCommentInput = { taskId: "some_task_id", content: "comment content" };
		const mockAuthInfo: UserAuthInfo = { id: "some_member_id", department: "WEBOPS", position: "CORE" };

		expect.assertions( 4 );
		return taskCommentService.addTaskComment( data, mockAuthInfo )
			.catch( e => {
				expect( e ).toBeInstanceOf( NotFoundException );
				expect( e.getStatus() ).toBe( 404 );
				expect( e.message ).toBe( TaskMessages.NOT_FOUND );
				expect( mockPrismaService.task.findUnique ).toHaveBeenCalledWith( {
					where: { id: "some_task_id" }
				} );
			} );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
	} );
} );