import { Field, InputType } from "@nestjs/graphql";
import { Department } from "@prisma/client";

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
	@Field() forDepartment: Department;
}

@InputType()
export class UpdateTaskInput {
	@Field() taskId: string;
	@Field() title?: string;
	@Field() description?: string;
	@Field() deadline?: string;
}