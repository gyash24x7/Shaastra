import { ExpressApplication } from "@shaastra/framework";
import events from "./events/index.js";
import { schema } from "./schema/index.js";

const application = new ExpressApplication( { name: "workforce", graphql: { schema }, events } );

export const { eventBus, consul, logger, appInfo } = application;

await application.start();