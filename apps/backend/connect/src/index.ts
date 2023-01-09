import { ExpressApplication } from "@shaastra/framework";
import events from "./events/index.js";
import { schema } from "./schema/index.js";

const application = new ExpressApplication( { name: "connect", graphql: { schema }, events } );

export const { logger } = application;

await application.start();