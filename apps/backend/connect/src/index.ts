import { PrismaClient } from "@prisma/client/connect/index.js";
import { ExpressApplication } from "@shaastra/framework";
import events from "./events/index.js";
import { channelResolvers, messageResolvers } from "./graphql/entity.resolvers.js";
import type { Resolvers } from "./graphql/generated/index.js";
import { mutationResolvers } from "./mutations/index.js";
import { queryResolvers } from "./queries/index.js";

export const prisma = new PrismaClient( {
	log: [ "query", "info", "warn", "error" ]
} );

const resolvers: Resolvers = {
	Query: queryResolvers,
	Mutation: mutationResolvers,
	Channel: channelResolvers,
	Message: messageResolvers
};

const application = new ExpressApplication( { name: "connect", events, prisma, resolvers } );
await application.start();
