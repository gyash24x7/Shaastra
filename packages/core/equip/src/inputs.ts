import type { Department } from "@backend/utils";

export type TaskIdInput = {
	taskId: string;
}

export type AssignTaskInput = {
	taskId: string;
	assigneeId: string;
}

export type CreateTaskInput = {
	title: string;
	description: string;
	deadline: string;
	forDepartment: Department;
}

export type UpdateTaskInput = {
	taskId: string;
	title: string;
	description: string;
	deadline: string;
}

export type AddTaskCommentInput = {
	taskId: string;
	content: string;
}