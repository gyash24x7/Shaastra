import { ExpressApplication } from "@shaastra/framework";
import events from "./events/index.js";
import { jwksRestApi } from "./rest/jwks.api.js";
import { userRestApi } from "./rest/user.api.js";
import { schema } from "./schema/index.js";

const application = new ExpressApplication( {
	name: "identity",
	restApis: [ jwksRestApi, userRestApi ],
	graphql: { schema },
	events
} );

export const { eventBus, logger, jwtUtils } = application;

await application.start();
