import { ExpressApplication } from "@shaastra/framework";
import events from "./events";
import { schema } from "./schema";

const application = new ExpressApplication( { name: "connect", graphql: { schema }, events } );

export const { logger, appInfo } = application;

export { schema };

const shouldStartApp = process.env[ "START_APP" ] === "true";

if ( shouldStartApp ) {
	application.start().then();
}
