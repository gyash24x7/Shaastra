import { LoggerFactory, PrismaExceptionCode, PrismaService } from "@api/common";
import { Injectable } from "@nestjs/common";
import type { TaskActivity } from "@prisma/client";
import { TaskMessages } from "../constants";

@Injectable()
export class TaskActivityService {
	private readonly logger = LoggerFactory.getLogger( TaskActivityService );

	constructor( private readonly prismaService: PrismaService ) {}

	async getTaskActivity( taskId: string ): Promise<TaskActivity[]> {
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