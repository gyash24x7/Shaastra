import dotenv from "dotenv";
import { ExpressServiceApplication, ServiceContext } from "@shaastra/framework";
import { PrismaClient } from "@prisma/client/identity";
import commands from "./commands/index.js";
import { typeDefs } from "./graphql/types.js";
import { resolvers } from "./graphql/resolvers.js";
import events from "./events/index.js";
import queries from "./queries/index.js";
import { jwksRestApi } from "./rest/jwks.api.js";
import { userRestApi } from "./rest/user.api.js";

dotenv.config();

export type AppContext = ServiceContext<PrismaClient>;

const application = new ExpressServiceApplication( {
	name: "identity",
	prisma: new PrismaClient(),
	graphql: { typeDefs, resolvers },
	cqrs: { commands, queries, events },
	restApis: [ jwksRestApi, userRestApi ]
} );

await application.start();