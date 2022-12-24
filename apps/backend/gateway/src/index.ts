import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { ExpressGatewayApplication } from "@shaastra/framework";

dotenv.config();

const supergraphSdl = await readFile( join( process.cwd(), "src/graphql/schema.graphql" ), "utf-8" );

const application = new ExpressGatewayApplication( {
	name: "gateway",
	restApis: [],
	graphql: { supergraphSdl }
} );

await application.start();