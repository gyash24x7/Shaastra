import { ChannelResolvers } from "./channel.resolvers.js";
import { MessageResolvers } from "./message.resolvers.js";
import { MutationResolvers } from "./mutation.resolvers.js";
import { QueryResolvers } from "./query.resolvers.js";

export * from "./query.resolvers.js";
export * from "./mutation.resolvers.js";
export * from "./channel.resolvers.js";
export * from "./message.resolvers.js";

const resolvers = [ QueryResolvers, MutationResolvers, MessageResolvers, ChannelResolvers ];
export default resolvers;