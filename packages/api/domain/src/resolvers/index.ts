import { MemberResolver } from "./member.resolver";
import { MutationResolver } from "./mutation.resolver";
import { QueryResolver } from "./query.resolver";
import { TaskActivityResolver } from "./task.activity.resolver";
import { TaskResolver } from "./task.resolver";
import { TeamResolver } from "./team.resolver";

export * from "./member.resolver";
export * from "./mutation.resolver";
export * from "./query.resolver";
export * from "./team.resolver";
export * from "./task.resolver";
export * from "./task.activity.resolver";

export const resolvers = [
	MemberResolver,
	MutationResolver,
	QueryResolver,
	TeamResolver,
	TaskResolver,
	TaskActivityResolver
];
