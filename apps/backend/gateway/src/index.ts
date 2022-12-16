import type { ServiceEndpointDefinition } from "@apollo/gateway";
import { Consul } from "@shaastra/consul";
import { HealthCheckController } from "@shaastra/health";
import { GatewayContextFn, generateAppConfig, startApolloGateway } from "@shaastra/utils";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { readFile } from "node:fs/promises";
import http from "node:http";
import { join } from "node:path";
import process from "node:process";
import signale from "signale";
import { CookiePlugin } from "./graphql/cookie.plugin.js";
import { ServiceDataSource } from "./graphql/service.datasource.js";

dotenv.config();

const config = generateAppConfig( "gateway" );
const app = express();
const httpServer = http.createServer( app );
const logger = new signale.Signale( { config: { displayTimestamp: true, displayBadge: true, displayScope: true } } );
const consul = new Consul( config.consul, logger );
const healthCheckController = new HealthCheckController();

app.use( bodyParser.json() );
app.use( cors( { origin: "http://localhost:3000", credentials: true } ) );

healthCheckController.register( app );

const supergraphSdl = await readFile( join( process.cwd(), "src/graphql/schema.graphql" ), "utf-8" );
const buildService = ( { url }: ServiceEndpointDefinition ) => new ServiceDataSource( { url } );
const context: GatewayContextFn = async ( { req, res } ) => (
	{ req, res, consul, config, logger }
);

await startApolloGateway( app, httpServer, supergraphSdl, buildService, context, logger, [ CookiePlugin() ] );

await new Promise<void>( ( resolve ) => httpServer.listen( { port: config.port }, resolve ) );
logger.scope( "Global" ).success( `🚀 ${ config.name } ready at ${ config.url }/api/graphql` );

await consul.register( config );