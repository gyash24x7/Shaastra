import type { AuthContext } from "@backend/utils";
import {
	type AddTaskCommentInput,
	type AssignTaskInput,
	type CreateTaskInput,
	prisma,
	type PrismaTypes,
	type TaskIdInput,
	type UpdateTaskInput
} from "@equip/core";
import SchemaBuilder from "@pothos/core";
import DirectivesPlugin from "@pothos/plugin-directives";
import FederationPlugin from "@pothos/plugin-federation";
import PrismaPlugin from "@pothos/plugin-prisma";

export const builder = new SchemaBuilder<{
	Scalars: {
		DateTime: { Output: Date; Input: Date; };
	};
	Context: AuthContext,
	PrismaTypes: PrismaTypes,
	Inputs: {
		AddTaskCommentInput: AddTaskCommentInput,
		CreateTaskInput: CreateTaskInput,
		AssignTaskInput: AssignTaskInput,
		TaskIdInput: TaskIdInput,
		UpdateTaskInput: UpdateTaskInput
	}
}>( {
	plugins: [ PrismaPlugin, DirectivesPlugin, FederationPlugin ],
	prisma: {
		client: prisma
	}
} );

export class ObjectTypes {
	public static readonly Task = "Task";
	public static readonly TaskActivity = "TaskActivity";
	public static readonly TaskComment = "TaskComment";
}

export class ExternalTypes {
	public static readonly Member = "Member";
}

export class Inputs {
	public static readonly CreateTaskInput = "CreateTaskInput";
	public static readonly UpdateTaskInput = "UpdateTaskInput";
	public static readonly TaskIdInput = "TaskIdInput";
	public static readonly AddTaskCommentInput = "AddTaskCommentInput";
	public static readonly AssignTaskInput = "AssignTaskInput";
}

export class Mutations {
	public static readonly CreateTask = "createTask";
	public static readonly UpdateTask = "updateTask";
	public static readonly AssignTask = "assignTask";
	public static readonly StartTaskProgress = "startTaskProgress";
	public static readonly SubmitTask = "submitTask";
	public static readonly ApproveTask = "approveTask";
	public static readonly CompleteTask = "completeTask";
	public static readonly AddTaskComment = "addTaskComment";
}

export class Queries {
	public static readonly Tasks = "tasks";
	public static readonly TasksRequested = "tasksRequested";
	public static readonly TaskActivity = "taskActivity";
	public static readonly TaskComments = "taskComments";
}