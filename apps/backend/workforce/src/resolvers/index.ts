import { MemberResolvers } from "./member.resolvers";
import { MutationResolvers } from "./mutation.resolvers";
import { QueryResolvers } from "./query.resolvers";
import { TeamResolvers } from "./team.resolvers";

export * from "./query.resolvers";
export * from "./mutation.resolvers";
export * from "./member.resolvers";
export * from "./team.resolvers";

const resolvers = [ QueryResolvers, MutationResolvers, MemberResolvers, TeamResolvers ];
export default resolvers;