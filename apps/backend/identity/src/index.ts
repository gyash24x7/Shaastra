import { ExpressApplication } from "@shaastra/framework";
import { PrismaClient } from "@prisma/client/identity/index.js";
import commands from "./commands/index.js";
import { resolvers } from "./graphql/resolvers.js";
import events from "./events/index.js";
import queries from "./queries/index.js";
import { jwksRestApi } from "./rest/jwks.api.js";
import { userRestApi } from "./rest/user.api.js";

export const prisma = new PrismaClient();

const application = new ExpressApplication( {
	name: "identity",
	cqrs: { commands, queries, events },
	restApis: [ jwksRestApi, userRestApi ],
	graphql: { resolvers }
} );

await application.start();