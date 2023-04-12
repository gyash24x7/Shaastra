import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import type { TaskActivityService } from "../services/task.activity.service";

@Resolver()
export class TaskActivityResolver {

	constructor( private readonly taskActivityService: TaskActivityService ) {}

	@ResolveField()
	async task( @Parent() { id }: { id: string } ) {
		return this.taskActivityService.getTask( id );
	}
}