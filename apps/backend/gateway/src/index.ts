import dotenv from "dotenv";
import { ExpressGatewayApplication } from "@shaastra/framework";

dotenv.config();

const application = new ExpressGatewayApplication( { name: "gateway" } );

await application.start();