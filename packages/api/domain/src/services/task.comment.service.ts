import { LoggerFactory, PrismaService, UserAuthInfo } from "@api/common";
import { Injectable, NotFoundException } from "@nestjs/common";
import type { Task, TaskComment } from "@prisma/client";
import { AddTaskCommentInput, TaskCommentMessages, TaskMessages } from "@api/domain";

@Injectable()
export class TaskCommentService {
	private readonly logger = LoggerFactory.getLogger( TaskCommentService );

	constructor( private readonly prismaService: PrismaService ) { }

	async getTask( taskCommentId: string ): Promise<Task> {
		this.logger.debug( ">> getTask()" );
		this.logger.debug( "TaskCommentId: %s", taskCommentId );

		const taskComment = await this.prismaService.taskComment.findUnique( {
			where: { id: taskCommentId },
			include: { task: true }
		} );

		if ( !taskComment ) {
			this.logger.error( "Task Comment Not Found! Id: %s", taskCommentId );
			throw new NotFoundException( TaskCommentMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTask()" );
		return taskComment.task;
	}

	async addTaskComment( data: AddTaskCommentInput, authInfo: UserAuthInfo ): Promise<TaskComment> {
		this.logger.debug( ">> addTaskComment()" );
		this.logger.debug( "Data: %o", data );

		const task = await this.prismaService.task.findUnique( {
			where: { id: data.taskId }
		} );

		if ( !task ) {
			this.logger.error( "Task Not Found! Id: %s", data.taskId );
			throw new NotFoundException( TaskMessages.NOT_FOUND );
		}

		const taskComment = await this.prismaService.taskComment.create( {
			data: {
				content: data.content,
				task: { connect: { id: data.taskId } },
				createdBy: { connect: { id: authInfo.id } }
			}
		} );

		this.logger.debug( "<< addTaskComment()" );
		return taskComment;
	}
}