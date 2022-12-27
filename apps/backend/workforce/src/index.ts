import { PrismaClient } from "@prisma/client/workforce/index.js";
import { ExpressServiceApplication, ServiceContext } from "@shaastra/framework";
import { resolvers } from "./graphql/resolvers.js";
import commands from "./commands/index.js";
import events from "./events/index.js";
import queries from "./queries/index.js";

export type AppContext = ServiceContext<PrismaClient>;

const application = new ExpressServiceApplication( {
	name: "workforce",
	prisma: new PrismaClient(),
	graphql: { resolvers },
	cqrs: { commands, queries, events },
	restApis: []
} );

await application.start();