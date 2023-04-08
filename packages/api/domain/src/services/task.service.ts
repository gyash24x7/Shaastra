import { LoggerFactory, PrismaExceptionCode, PrismaService } from "@api/common";
import { TaskMessages } from "@api/domain";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskService {
	private readonly logger = LoggerFactory.getLogger( TaskService );

	constructor( private readonly prismaService: PrismaService ) {}

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
}