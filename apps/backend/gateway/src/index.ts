import { defaultApplicationOptions, ExpressApplication } from "@shaastra/framework";

const application = new ExpressApplication( { ...defaultApplicationOptions, name: "gateway" } );

await application.start();