import { ExpressApplication } from "@shaastra/framework";
import events from "./events";
import { jwksRestApi } from "./rest/jwks.api";
import { userRestApi } from "./rest/user.api";
import { schema } from "./schema";

const application = new ExpressApplication( {
	name: "identity",
	restApis: [ jwksRestApi, userRestApi ],
	graphql: { schema },
	events
} );

export const { eventBus, logger, jwtUtils, appInfo } = application;

export { schema };

const shouldStartApp = process.env[ "START_APP" ] === "true";

if ( shouldStartApp ) {
	application.start().then();
}