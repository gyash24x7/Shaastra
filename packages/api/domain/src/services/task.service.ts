import { LoggerFactory, PrismaExceptionCode, PrismaService, UserAuthInfo } from "@api/common";
import { TaskEvents, TaskMessages } from "@api/domain";
import { Injectable } from "@nestjs/common";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import { MemberPosition, Prisma, TaskStatus } from "@prisma/client";
import type { AssignTaskInput, CreateTaskInput, TaskIdInput, UpdateTaskInput } from "../inputs";

@Injectable()
export class TaskService {
	private readonly logger = LoggerFactory.getLogger( TaskService );

	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventEmitter: EventEmitter2
	) {}

	async getTaskCreator( taskId: string ) {
		this.logger.debug( ">> getTaskCreator()" );
		this.logger.debug( "TaskId: %s", taskId );

		return this.prismaService.task
			.findUniqueOrThrow( { where: { id: taskId } } )
			.createdBy()
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: TaskMessages.NOT_FOUND
				} )
			);
	}

	async getTaskAssignee( taskId: string ) {
		this.logger.debug( ">> getTaskAssignee()" );
		this.logger.debug( "TaskId: %s", taskId );

		return this.prismaService.task
			.findUniqueOrThrow( { where: { id: taskId } } )
			.assignee()
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: TaskMessages.NOT_FOUND
				} )
			);
	}

	async getTaskActivity( taskId: string ) {
		this.logger.debug( ">> getTaskActivity()" );
		this.logger.debug( "TaskId: %s", taskId );

		return this.prismaService.task
			.findUniqueOrThrow( { where: { id: taskId } } )
			.taskActivity()
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: TaskMessages.NOT_FOUND
				} )
			);
	}

	async createTask( data: CreateTaskInput, authInfo: UserAuthInfo ) {
		this.logger.debug( ">> createTask()" );
		this.logger.debug( "Data: %o", data );

		const task = await this.prismaService.task.create( {
			data: {
				...data,
				createdById: authInfo.id,
				byDepartment: authInfo.department!
			}
		} );

		this.eventEmitter.emit( TaskEvents.CREATED, task );
		return task;
	}

	async updateTask( { taskId, ...data }: UpdateTaskInput ) {
		this.logger.debug( ">> updateTask()" );
		this.logger.debug( "Data: %o", data );

		const updatedTask = await this.prismaService.task
			.update( { where: { id: taskId }, data } )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: TaskMessages.NOT_FOUND
				} )
			);

		this.eventEmitter.emit( TaskEvents.UPDATED, updatedTask );
		return updatedTask;
	}

	async assignTask( { taskId, ...data }: AssignTaskInput ) {
		this.logger.debug( ">> assignTask()" );
		this.logger.debug( "Data: %o", data );

		const updatedTask = await this.prismaService.task
			.update( { where: { id: taskId }, data: { ...data, status: TaskStatus.ASSIGNED } } )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: TaskMessages.NOT_FOUND
				} )
			);

		this.eventEmitter.emit( TaskEvents.ASSIGNED, updatedTask );
		return updatedTask;
	}

	async startTaskProgress( { taskId }: TaskIdInput ) {
		this.logger.debug( ">> startTaskProgress()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus( taskId, TaskStatus.IN_PROGRESS );
		this.eventEmitter.emit( TaskEvents.PROGRESS_STARTED, updatedTask );
		return updatedTask;
	}

	async submitTask( { taskId }: TaskIdInput ) {
		this.logger.debug( ">> submitTask()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus( taskId, TaskStatus.SUBMITTED );
		this.eventEmitter.emit( TaskEvents.SUBMITTED, updatedTask );
		return updatedTask;
	}

	async approveTask( { taskId }: TaskIdInput ) {
		this.logger.debug( ">> approveTask()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus( taskId, TaskStatus.APPROVED );
		this.eventEmitter.emit( TaskEvents.APPROVED, updatedTask );
		return updatedTask;
	}

	async completeTask( { taskId }: TaskIdInput ) {
		this.logger.debug( ">> completeTask()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus( taskId, TaskStatus.COMPLETED );
		this.eventEmitter.emit( TaskEvents.COMPLETED, updatedTask );
		return updatedTask;
	}

	async getTasks( authInfo: UserAuthInfo, isTasksRequested: boolean ) {
		this.logger.debug( ">> getTasks()" );
		this.logger.debug( "AuthInfo: %o, IsTasksRequested: %s", authInfo, isTasksRequested );

		const where: Prisma.TaskWhereInput = {};

		if ( authInfo.position !== MemberPosition.COCAS ) {
			if ( isTasksRequested ) {
				where.byDepartment = authInfo.department;
			} else {
				where.forDepartment = authInfo.department;
			}

			if ( authInfo.position !== MemberPosition.CORE ) {
				where.assigneeId = authInfo.id;
			}
		}

		return this.prismaService.task.findMany( { where } );
	}

	private async updateTaskStatus( taskId: string, status: TaskStatus ) {
		this.logger.debug( ">> updateTaskStatus()" );

		return await this.prismaService.task
			.update( { where: { id: taskId }, data: { status } } )
			.catch(
				this.prismaService.handleException( {
					code: PrismaExceptionCode.RECORD_NOT_FOUND,
					message: TaskMessages.NOT_FOUND
				} )
			);
	}
}