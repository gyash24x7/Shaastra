export class Messages {
	public static readonly TASK_NOT_FOUND = "Task Not Found!";
	public static readonly TASK_ACTIVITY_NOT_FOUND = "Task Activity Not Found!";
	public static readonly TASK_COMMENT_NOT_FOUND = "Task Comment Not Found!";
	public static readonly INVALID_ACTION = "Invalid Action!";
}

export const Statuses = {
	REQUESTED: "REQUESTED",
	ASSIGNED: "ASSIGNED",
	IN_PROGRESS: "IN_PROGRESS",
	SUBMITTED: "SUBMITTED",
	APPROVED: "APPROVED",
	COMPLETED: "COMPLETED"
};

export const ActivityTypes = {
	CREATED: "CREATED",
	STATUS_CHANGED: "STATUS_CHANGED",
	UPDATED: "UPDATED",
	DELETED: "DELETED"
};

export type TaskStatus = keyof typeof Statuses;

export type TaskActivityType = keyof typeof ActivityTypes;