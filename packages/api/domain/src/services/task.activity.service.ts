import { LoggerFactory, PrismaService } from "@api/common";
import { Injectable, NotFoundException } from "@nestjs/common";
import type { Task } from "@prisma/client";
import { TaskActivityMessages } from "../constants";

@Injectable()
export class TaskActivityService {
	private readonly logger = LoggerFactory.getLogger( TaskActivityService );

	constructor( private readonly prismaService: PrismaService ) { }

	async getTask( taskActivityId: string ): Promise<Task> {
		this.logger.debug( ">> getTask()" );
		this.logger.debug( "TaskActivityId: %s", taskActivityId );

		const taskActivity = await this.prismaService.taskActivity.findUnique( {
			where: { id: taskActivityId },
			include: { task: true }
		} );

		if ( !taskActivity ) {
			this.logger.error( "Task Activity Not Found! Id: %s", taskActivityId );
			throw new NotFoundException( TaskActivityMessages.NOT_FOUND );
		}

		this.logger.debug( "<< getTask()" );
		return taskActivity.task;
	}
}