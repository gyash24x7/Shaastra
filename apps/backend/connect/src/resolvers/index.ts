import { ChannelResolvers } from "./channel.resolvers";
import { MessageResolvers } from "./message.resolvers";
import { MutationResolvers } from "./mutation.resolvers";
import { QueryResolvers } from "./query.resolvers";

export * from "./query.resolvers";
export * from "./mutation.resolvers";
export * from "./channel.resolvers";
export * from "./message.resolvers";

const resolvers = [ QueryResolvers, MutationResolvers, MessageResolvers, ChannelResolvers ];
export default resolvers;