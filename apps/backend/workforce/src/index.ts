import { PrismaClient } from "@prisma/client/workforce/index.js";
import { ExpressApplication } from "@shaastra/framework";
import events from "./events/index.js";
import { teamResolvers, memberResolvers } from "./graphql/entity.resolvers.js";
import type { Resolvers } from "./graphql/generated/index.js";
import { mutationResolvers } from "./mutations/index.js";
import { queryResolvers } from "./queries/index.js";

export const prisma = new PrismaClient( {
	log: [ "query", "info", "warn", "error" ]
} );

const resolvers: Resolvers = {
	Query: queryResolvers,
	Mutation: mutationResolvers,
	Member: memberResolvers,
	Team: teamResolvers
};

const application = new ExpressApplication( { name: "workforce", events, prisma, resolvers } );
await application.start();