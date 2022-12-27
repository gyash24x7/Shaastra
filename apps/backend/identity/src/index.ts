import { ExpressServiceApplication, ServiceContext } from "@shaastra/framework";
import { PrismaClient } from "@prisma/client/identity/index.js";
import commands from "./commands/index.js";
import { resolvers } from "./graphql/resolvers.js";
import events from "./events/index.js";
import queries from "./queries/index.js";
import { jwksRestApi } from "./rest/jwks.api.js";
import { userRestApi } from "./rest/user.api.js";

export type AppContext = ServiceContext<PrismaClient>;

const application = new ExpressServiceApplication( {
	name: "identity",
	prisma: new PrismaClient(),
	cqrs: { commands, queries, events },
	restApis: [ jwksRestApi, userRestApi ],
	graphql: { resolvers }
} );

await application.start();