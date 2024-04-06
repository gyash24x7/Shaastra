import { type AuthInfo, createLogger, Positions } from "@backend/utils";
import type { Prisma, PrismaClient, Task } from "../generated";
import { Messages, Statuses } from "./constants.ts";
import type { AddTaskCommentInput, AssignTaskInput, CreateTaskInput, UpdateTaskInput } from "./inputs.ts";
import { prisma } from "./prisma.ts";

export class EquipService {
	private readonly logger = createLogger( EquipService.name );

	constructor( private readonly prisma: PrismaClient ) { }

	async getTaskCreator( taskId: string ) {
		this.logger.debug( ">> getTaskCreator()" );
		this.logger.debug( "TaskId: %s", taskId );

		const task = await this.prisma.task.findUnique( {
			where: { id: taskId }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new Error( Messages.TASK_NOT_FOUND );
		}

		this.logger.debug( "<< getTaskCreator()" );
		return task.createdBy;
	}

	async getTaskAssignee( taskId: string ) {
		this.logger.debug( ">> getTaskAssignee()" );
		this.logger.debug( "TaskId: %s", taskId );

		const task = await this.prisma.task.findUnique( {
			where: { id: taskId }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new Error( Messages.TASK_NOT_FOUND );
		}

		this.logger.debug( "<< getTaskAssignee()" );
		return task.assigneeId;
	}

	async getTaskActivityForTask( taskId: string ) {
		this.logger.debug( ">> getTaskActivity()" );
		this.logger.debug( "TaskId: %s", taskId );

		const task = await this.prisma.task.findUnique( {
			where: { id: taskId },
			include: { activity: true }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new Error( Messages.TASK_NOT_FOUND );
		}

		this.logger.debug( "<< getTaskActivity()" );
		return task.activity;
	}

	async getTaskComments( taskId: string ) {
		this.logger.debug( ">> getTaskComment()" );
		this.logger.debug( "TaskId: %s", taskId );

		const task = await this.prisma.task.findUnique( {
			where: { id: taskId },
			include: { comments: true }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new Error( Messages.TASK_NOT_FOUND );
		}

		this.logger.debug( "<< getTaskComment()" );
		return task.comments;
	}

	async createTask( data: CreateTaskInput, authInfo: AuthInfo ) {
		this.logger.debug( ">> createTask()" );
		this.logger.debug( "Data: %o", data );

		const task = await this.prisma.task.create( {
			data: {
				...data,
				createdBy: authInfo.id,
				byDepartment: authInfo.department!
			}
		} );

		this.logger.debug( "<< createTask()" );
		return task;
	}

	async updateTask( { taskId, ...data }: UpdateTaskInput, authInfo: AuthInfo ) {
		this.logger.debug( ">> updateTask()" );
		this.logger.debug( "Data: %o", data );

		const task = await this.prisma.task.findUnique( { where: { id: taskId } } );
		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new Error( Messages.TASK_NOT_FOUND );
		}

		if ( task.createdBy !== authInfo.id ) {
			this.logger.error( "Unauthorized to Update Task! TaskId: %s", taskId );
			throw new Error( Messages.INVALID_ACTION );
		}

		const updatedTask = await this.prisma.task.update( {
			where: { id: taskId },
			data: { ...data }
		} );

		this.logger.debug( "<< updateTask()" );
		return updatedTask;
	}

	async assignTask( { taskId, ...data }: AssignTaskInput, authInfo: AuthInfo ) {
		this.logger.debug( ">> assignTask()" );
		this.logger.debug( "Data: %o", data );

		const task = await this.prisma.task.findUnique( { where: { id: taskId } } );
		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new Error( Messages.TASK_NOT_FOUND );
		}

		if ( authInfo.position !==
			Positions.CORE ||
			task.forDepartment !==
			authInfo.department ||
			task.status !==
			Statuses.REQUESTED ) {
			this.logger.error( "Unauthorized to Assign Task! TaskId: %s", taskId );
			throw new Error( Messages.INVALID_ACTION );
		}

		const updatedTask = await this.prisma.task.update( {
			where: { id: taskId },
			data: { ...data, status: "ASSIGNED" }
		} );

		this.logger.debug( "<< assignTask()" );
		return updatedTask;
	}

	async startTaskProgress( taskId: string, authInfo: AuthInfo ) {
		this.logger.debug( ">> startTaskProgress()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus(
			taskId,
			Statuses.IN_PROGRESS,
			task => task.assigneeId === authInfo.id && task.status === Statuses.ASSIGNED
		);

		this.logger.debug( "<< startTaskProgress()" );
		return updatedTask;
	}

	async submitTask( taskId: string, authInfo: AuthInfo ) {
		this.logger.debug( ">> submitTask()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus(
			taskId,
			Statuses.SUBMITTED,
			task => task.status === Statuses.IN_PROGRESS && task.assigneeId === authInfo.id
		);
		this.logger.debug( "<< submitTask()" );
		return updatedTask;
	}

	async approveTask( taskId: string, authInfo: AuthInfo ) {
		this.logger.debug( ">> approveTask()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus(
			taskId,
			Statuses.APPROVED,
			task => authInfo.position === Positions.CORE &&
				task.status === Statuses.SUBMITTED &&
				task.forDepartment === authInfo.department
		);

		this.logger.debug( "<< approveTask()" );
		return updatedTask;
	}

	async completeTask( taskId: string, authInfo: AuthInfo ) {
		this.logger.debug( ">> completeTask()" );
		this.logger.debug( "Data: %o", { taskId } );

		const updatedTask = await this.updateTaskStatus(
			taskId,
			Statuses.COMPLETED,
			task => task.status === Statuses.APPROVED &&
				authInfo.position === Positions.CORE &&
				authInfo.department === task.byDepartment
		);

		this.logger.debug( "<< completeTask()" );
		return updatedTask;
	}

	async getTask( taskId: string ) {
		this.logger.debug( ">> getTask()" );
		this.logger.debug( "Data: %s", { taskId } );

		const task = await this.prisma.task.findUnique( {
			where: { id: taskId }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new Error( Messages.TASK_NOT_FOUND );
		}

		this.logger.debug( "<< getTask()" );
		return task;
	}

	async getTasks( authInfo: AuthInfo, isTasksRequested: boolean ) {
		this.logger.debug( ">> getTasks()" );
		this.logger.debug( "AuthInfo: %o, IsTasksRequested: %s", authInfo, isTasksRequested );

		const where: Prisma.TaskWhereInput = {};

		if ( authInfo.position !== "COCAS" ) {
			if ( isTasksRequested ) {
				where.byDepartment = authInfo.department;
			} else {
				where.forDepartment = authInfo.department;
			}

			if ( authInfo.position !== "CORE" ) {
				where.assigneeId = authInfo.id;
			}
		}

		const tasks = await this.prisma.task.findMany( { where } );
		this.logger.debug( "<< getTasks()" );
		return tasks;
	}

	async getTaskActivity( taskActivityId: string ) {
		this.logger.debug( ">> getTaskActivity()" );
		this.logger.debug( "TaskActivityId: %s", taskActivityId );

		const taskActivity = await this.prisma.taskActivity.findUnique( {
			where: { id: taskActivityId }
		} );

		if ( !taskActivity ) {
			this.logger.error( "Task Activity Not Found! Id: %s", taskActivityId );
			throw new Error( Messages.TASK_ACTIVITY_NOT_FOUND );
		}

		this.logger.debug( "<< getTaskActivity()" );
		return taskActivity;
	}

	async getTaskForTaskActivity( taskActivityId: string ): Promise<Task> {
		this.logger.debug( ">> getTask()" );
		this.logger.debug( "TaskActivityId: %s", taskActivityId );

		const taskActivity = await this.prisma.taskActivity.findUnique( {
			where: { id: taskActivityId },
			include: { task: true }
		} );

		if ( !taskActivity ) {
			this.logger.error( "Task Activity Not Found! Id: %s", taskActivityId );
			throw new Error( Messages.TASK_ACTIVITY_NOT_FOUND );
		}

		this.logger.debug( "<< getTask()" );
		return taskActivity.task;
	}

	async getTaskComment( taskCommentId: string ) {
		this.logger.debug( ">> getTaskComment()" );
		this.logger.debug( "TaskCommentId: %s", taskCommentId );

		const taskComment = await this.prisma.taskComment.findUnique( {
			where: { id: taskCommentId }
		} );

		if ( !taskComment ) {
			this.logger.error( "Task Comment Not Found! Id: %s", taskCommentId );
			throw new Error( Messages.TASK_COMMENT_NOT_FOUND );
		}

		this.logger.debug( "<< getTaskComment()" );
		return taskComment;
	}

	async getTaskForTaskComment( taskCommentId: string ) {
		this.logger.debug( ">> getTask()" );
		this.logger.debug( "TaskCommentId: %s", taskCommentId );

		const taskComment = await this.prisma.taskComment.findUnique( {
			where: { id: taskCommentId },
			include: { task: true }
		} );

		if ( !taskComment ) {
			this.logger.error( "Task Comment Not Found! Id: %s", taskCommentId );
			throw new Error( Messages.TASK_COMMENT_NOT_FOUND );
		}

		this.logger.debug( "<< getTask()" );
		return taskComment.task;
	}

	async addTaskComment( data: AddTaskCommentInput, authInfo: AuthInfo ) {
		this.logger.debug( ">> addTaskComment()" );
		this.logger.debug( "Data: %o", data );

		const task = await this.prisma.task.findUnique( {
			where: { id: data.taskId }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", data.taskId );
			throw new Error( Messages.TASK_NOT_FOUND );
		}

		const taskComment = await this.prisma.taskComment.create( {
			data: {
				content: data.content,
				task: { connect: { id: data.taskId } },
				createdBy: authInfo.id
			}
		} );

		this.logger.debug( "<< addTaskComment()" );
		return taskComment;
	}

	async getTasksAssigned( memberId: string ) {
		this.logger.debug( ">> getTasksAssigned()" );
		this.logger.debug( "Data: %o", { memberId } );

		const tasks = await this.prisma.task.findMany( {
			where: { assigneeId: memberId }
		} );

		this.logger.debug( "<< getTasksAssigned()" );
		return tasks;
	}

	async getTasksCreated( memberId: string ) {
		this.logger.debug( ">> getTasksCreated()" );
		this.logger.debug( "Data: %o", { memberId } );

		const tasks = await this.prisma.task.findMany( {
			where: { createdBy: memberId }
		} );

		this.logger.debug( "<< getTasksCreated()" );
		return tasks;
	}

	private async updateTaskStatus( taskId: string, status: string, predicate?: ( task: Task ) => boolean ) {
		this.logger.debug( ">> updateTaskStatus()" );

		let task = await this.prisma.task.findUnique( { where: { id: taskId } } );
		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", taskId );
			throw new Error( Messages.TASK_NOT_FOUND );
		}

		if ( predicate && !predicate( task ) ) {
			this.logger.error( "Invalid Action! TaskId: %s, Status: %s", taskId, task.status );
			throw new Error( Messages.INVALID_ACTION );
		}

		task = await this.prisma.task.update( {
			where: { id: taskId },
			data: { status }
		} );

		this.logger.debug( "<< updateTaskStatus()" );
		return task;
	}
}

export const equipService = new EquipService( prisma );