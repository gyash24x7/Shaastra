import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AddTaskCommentInput {
	@Field() taskId: string;
	@Field() content: string;
}