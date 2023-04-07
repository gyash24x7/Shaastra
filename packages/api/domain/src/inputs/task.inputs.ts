import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class TaskIdInput {
	@Field() taskId: string;
}

@InputType()
export class AssignTaskInput {
	@Field() taskId: string;
	@Field() assigneeId: string;
}

@InputType()
export class CreateTaskInput {
	@Field() title: string;
	@Field() description: string;
	@Field() deadline: string;
}

@InputType()
export class UpdateTaskInput {
	@Field() title?: string;
	@Field() description?: string;
	@Field() deadline?: string;
}