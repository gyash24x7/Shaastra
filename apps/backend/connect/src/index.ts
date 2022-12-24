import { PrismaClient } from "@prisma/client/connect/index.js";
import dotenv from "dotenv";
import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/types.js";
import { ExpressServiceApplication, ServiceContext } from "@shaastra/framework";
import commands from "./commands/index.js";
import queries from "./queries/index.js";
import events from "./events/index.js";

dotenv.config();

export type AppContext = ServiceContext<PrismaClient>;

const application = new ExpressServiceApplication( {
	name: "connect",
	prisma: new PrismaClient(),
	graphql: { typeDefs, resolvers },
	cqrs: { commands, queries, events },
	restApis: []
} );

await application.start();