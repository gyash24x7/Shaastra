import { LoggerFactory, PrismaService, UserAuthInfo } from "@api/common";
import { TaskEvents, TaskMessages } from "@api/domain";
import { Injectable, NotFoundException } from "@nestjs/common";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import { Member, Position, Prisma, Task, TaskActivity, TaskComment, TaskStatus } from "@prisma/client";
import type { AssignTaskInput, CreateTaskInput, TaskIdInput, UpdateTaskInput } from "../inputs";

@Injectable()
export class TaskService {
	private readonly logger = LoggerFactory.getLogger( TaskService );

	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventEmitter: EventEmitter2
	) { }

	async getTaskCreator( taskId: string ): Promise<Member> {
		this.logger.debug( ">> getTaskCreator()" );
		this.logger.debug( "TaskId: %s", taskId );

		const task = await this.prismaService.task.findUnique( {
			where: { id: taskId },
			include: { createdBy: true }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new NotFoundException( TaskMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTaskCreator()" );
		return task.createdBy;
	}

	async getTaskAssignee( taskId: string ): Promise<Member | null> {
		this.logger.debug( ">> getTaskAssignee()" );
		this.logger.debug( "TaskId: %s", taskId );

		const task = await this.prismaService.task.findUnique( {
			where: { id: taskId },
			include: { assignee: true }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new NotFoundException( TaskMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTaskAssignee()" );
		return task.assignee;
	}

	async getTaskActivity( taskId: string ): Promise<TaskActivity[]> {
		this.logger.debug( ">> getTaskActivity()" );
		this.logger.debug( "TaskId: %s", taskId );

		const task = await this.prismaService.task.findUnique( {
			where: { id: taskId },
			include: { activity: true }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new NotFoundException( TaskMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTaskActivity()" );
		return task.activity;
	}

	async getTaskComments( taskId: string ): Promise<TaskComment[]> {
		this.logger.debug( ">> getTaskComment()" );
		this.logger.debug( "TaskId: %s", taskId );

		const task = await this.prismaService.task.findUnique( {
			where: { id: taskId },
			include: { comments: true }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new NotFoundException( TaskMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTaskComment()" );
		return task.comments;
	}

	async createTask( data: CreateTaskInput, authInfo: UserAuthInfo ): Promise<Task> {
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
		this.logger.debug( "<< createTask()" );
		return task;
	}

	async updateTask( { taskId, ...data }: UpdateTaskInput ): Promise<Task> {
		this.logger.debug( ">> updateTask()" );
		this.logger.debug( "Data: %o", data );

		const task = await this.prismaService.task.findUnique( { where: { id: taskId } } );
		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new NotFoundException( TaskMessages.NOT_FOUND );
		}

		const updatedTask = await this.prismaService.task.update( { where: { id: taskId }, data } );

		this.eventEmitter.emit( TaskEvents.UPDATED, updatedTask );
		this.logger.debug( "<< updateTask()" );
		return updatedTask;
	}

	async assignTask( { taskId, ...data }: AssignTaskInput ): Promise<Task> {
		this.logger.debug( ">> assignTask()" );
		this.logger.debug( "Data: %o", data );

		const task = await this.prismaService.task.findUnique( { where: { id: taskId } } );
		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new NotFoundException( TaskMessages.NOT_FOUND );
		}

		const updatedTask = await this.prismaService.task.update( {
			where: { id: taskId },
			data: { ...data, status: TaskStatus.ASSIGNED }
		} );

		this.eventEmitter.emit( TaskEvents.ASSIGNED, updatedTask );
		this.logger.debug( "<< assignTask()" );
		return updatedTask;
	}

	async startTaskProgress( { taskId }: TaskIdInput ): Promise<Task> {
		this.logger.debug( ">> startTaskProgress()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus( taskId, TaskStatus.IN_PROGRESS );
		this.eventEmitter.emit( TaskEvents.PROGRESS_STARTED, updatedTask );
		this.logger.debug( "<< startTaskProgress()" );
		return updatedTask;
	}

	async submitTask( { taskId }: TaskIdInput ): Promise<Task> {
		this.logger.debug( ">> submitTask()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus( taskId, TaskStatus.SUBMITTED );
		this.eventEmitter.emit( TaskEvents.SUBMITTED, updatedTask );
		this.logger.debug( "<< submitTask()" );
		return updatedTask;
	}

	async approveTask( { taskId }: TaskIdInput ): Promise<Task> {
		this.logger.debug( ">> approveTask()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus( taskId, TaskStatus.APPROVED );
		this.eventEmitter.emit( TaskEvents.APPROVED, updatedTask );
		this.logger.debug( "<< approveTask()" );
		return updatedTask;
	}

	async completeTask( { taskId }: TaskIdInput ): Promise<Task> {
		this.logger.debug( ">> completeTask()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus( taskId, TaskStatus.COMPLETED );
		this.eventEmitter.emit( TaskEvents.COMPLETED, updatedTask );
		this.logger.debug( "<< completeTask()" );
		return updatedTask;
	}

	async getTasks( authInfo: UserAuthInfo, isTasksRequested: boolean ): Promise<Task[]> {
		this.logger.debug( ">> getTasks()" );
		this.logger.debug( "AuthInfo: %o, IsTasksRequested: %s", authInfo, isTasksRequested );

		const where: Prisma.TaskWhereInput = {};

		if ( authInfo.position !== Position.COCAS ) {
			if ( isTasksRequested ) {
				where.byDepartment = authInfo.department;
			} else {
				where.forDepartment = authInfo.department;
			}

			if ( authInfo.position !== Position.CORE ) {
				where.assigneeId = authInfo.id;
			}
		}

		const tasks = await this.prismaService.task.findMany( { where } );
		this.logger.debug( "<< getTasks()" );
		return tasks;
	}

	private async updateTaskStatus( taskId: string, status: TaskStatus ): Promise<Task> {
		this.logger.debug( ">> updateTaskStatus()" );

		let task = await this.prismaService.task.findUnique( { where: { id: taskId } } );
		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new NotFoundException( TaskMessages.NOT_FOUND );
		}

		task = await this.prismaService.task.update( { where: { id: taskId }, data: { status } } );
		this.logger.debug( "<< updateTaskStatus()" );
		return task;
	}
}