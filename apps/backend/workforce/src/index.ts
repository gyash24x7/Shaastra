import { PrismaClient } from "@prisma/client/workforce/index.js";
import { Consul } from "@shaastra/consul";
import { HealthCheckController } from "@shaastra/health";
import { Mailer } from "@shaastra/mail";
import type { ServiceContextFn } from "@shaastra/utils";
import { generateAppConfig, startApolloServer } from "@shaastra/utils";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "node:http";
import signale from "signale";
import { commandBus } from "./commands/index.js";
import { eventBus } from "./events/index.js";
import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/types.js";
import { queryBus } from "./queries/index.js";
import { buildSubgraphSchema } from "@apollo/subgraph";

dotenv.config();

const config = generateAppConfig( "workforce" );
const app = express();
const httpServer = http.createServer( app );
const logger = new signale.Signale( {
	config: {
		displayTimestamp: true,
		displayBadge: true,
		displayScope: true
	}
} );
const consul = new Consul( config.consul, logger.scope( Consul.name ) );
const prisma = new PrismaClient( { log: [ "query" ] } );
const mailer = new Mailer( config.mail?.apiKey!, config.mail?.apiSecret! );

const healthCheckController = new HealthCheckController();

const createContext: ServiceContextFn<PrismaClient> = async ( { req, res } ) => {
	return { req, res, prisma, commandBus, queryBus, eventBus, mailer, logger, consul, config };
};

app.use( bodyParser.json() );
app.use( cors( { origin: "http://localhost:9000", credentials: true } ) );

healthCheckController.register( app );

const schema = buildSubgraphSchema( { typeDefs, resolvers } as any );

await startApolloServer( app, httpServer, schema, logger, createContext );

await new Promise<void>( ( resolve ) => httpServer.listen( { port: config.port }, resolve ) );
logger.scope( "Global" ).success( `🚀 ${ config.name } ready at ${ config.url }/api/graphql` );

await consul.register( config );