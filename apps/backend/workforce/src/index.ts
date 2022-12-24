import { PrismaClient } from "@prisma/client/workforce/index.js";
import { ExpressServiceApplication, ServiceContext } from "@shaastra/framework";
import dotenv from "dotenv";
import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/types.js";
import commands from "./commands/index.js";
import events from "./events/index.js";
import queries from "./queries/index.js";

dotenv.config();

export type AppContext = ServiceContext<PrismaClient>;

const application = new ExpressServiceApplication( {
	name: "workforce",
	prisma: new PrismaClient(),
	graphql: { typeDefs, resolvers },
	cqrs: { commands, queries, events },
	restApis: []
} );

await application.start();