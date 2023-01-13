import type { MutationResolvers } from "../graphql/generated/index.js";
import { createChannelMutationResolver } from "./create.channel.mutation.js";
import { createMessageMutationResolver } from "./create.message.mutation.js";

export * from "./create.channel.mutation.js";
export * from "./create.message.mutation.js";

export const mutationResolvers: MutationResolvers = {
	createChannel: createChannelMutationResolver,
	createMessage: createMessageMutationResolver
};