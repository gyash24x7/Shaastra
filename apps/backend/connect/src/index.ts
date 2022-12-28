import { PrismaClient } from "@prisma/client/connect/index.js";
import { resolvers } from "./graphql/resolvers.js";
import { ExpressApplication } from "@shaastra/framework";
import commands from "./commands/index.js";
import queries from "./queries/index.js";
import events from "./events/index.js";

export const prisma = new PrismaClient();

const application = new ExpressApplication( {
	name: "connect",
	graphql: { resolvers },
	cqrs: { commands, queries, events }
} );

await application.start();