import { PrismaClient } from "@prisma/client/connect/index.js";
import dotenv from "dotenv";
import { resolvers } from "./graphql/resolvers.js";
import { ExpressServiceApplication, ServiceContext } from "@shaastra/framework";
import commands from "./commands/index.js";
import queries from "./queries/index.js";
import events from "./events/index.js";

dotenv.config();

export type AppContext = ServiceContext<PrismaClient>;

const application = new ExpressServiceApplication( {
	name: "connect",
	prisma: new PrismaClient(),
	graphql: { resolvers },
	cqrs: { commands, queries, events }
} );

await application.start();