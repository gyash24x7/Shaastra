import { ExpressGatewayApplication } from "@shaastra/framework";

const application = new ExpressGatewayApplication( { name: "gateway" } );

await application.start();