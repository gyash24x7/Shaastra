import { MemberService } from "./member.service";
import { TaskActivityService } from "./task.activity.service";
import { TaskService } from "./task.service";
import { TeamService } from "./team.service";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";
import { TaskCommentService } from "./task.comment.service";

export * from "./member.service";
export * from "./team.service";
export * from "./token.service";
export * from "./user.service";
export * from "./task.service";
export * from "./task.activity.service";
export * from "./task.comment.service";

export const services = [
	MemberService,
	UserService,
	TeamService,
	TokenService,
	TaskService,
	TaskActivityService,
	TaskCommentService
];
