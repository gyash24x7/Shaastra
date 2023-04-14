import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import type { TaskCommentService } from "../services";

@Resolver()
export class TaskCommentResolver {

	constructor( private readonly taskCommentService: TaskCommentService ) {}

	@ResolveField()
	async task( @Parent() { id }: { id: string } ) {
		return this.taskCommentService.getTask( id );
	}
}