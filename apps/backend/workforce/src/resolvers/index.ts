import { MemberResolvers } from "./member.resolvers.js";
import { MutationResolvers } from "./mutation.resolvers.js";
import { QueryResolvers } from "./query.resolvers.js";
import { TeamResolvers } from "./team.resolvers.js";

export * from "./query.resolvers.js";
export * from "./mutation.resolvers.js";
export * from "./member.resolvers.js";
export * from "./team.resolvers.js";

const resolvers = [ QueryResolvers, MutationResolvers, MemberResolvers, TeamResolvers ];
export default resolvers;