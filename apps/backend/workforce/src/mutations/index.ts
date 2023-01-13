import type { MutationResolvers } from "../graphql/generated/index.js";
import { createMemberMutationResolver } from "./create.member.mutation.js";
import { createTeamMutationResolver } from "./create.team.mutation.js";
import { enableMemberMutationResolver } from "./enable.member.mutation.js";

export * from "./create.member.mutation.js";
export * from "./create.team.mutation.js";
export * from "./enable.member.mutation.js";

export const mutationResolvers: MutationResolvers = {
	createTeam: createTeamMutationResolver,
	createMember: createMemberMutationResolver,
	enableMember: enableMemberMutationResolver
};