import { PrismaClient } from "@prisma/client/workforce/index.js";
import { ExpressApplication } from "@shaastra/framework";
import { resolvers } from "./graphql/resolvers.js";
import commands from "./commands/index.js";
import events from "./events/index.js";
import queries from "./queries/index.js";

export const prisma = new PrismaClient();

const application = new ExpressApplication( {
	name: "workforce",
	graphql: { resolvers },
	cqrs: { commands, queries, events },
	restApis: []
} );

await application.start();