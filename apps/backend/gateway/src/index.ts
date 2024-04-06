import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { createLogger } from "@backend/utils";
import cors from "cors";
import express from "express";
import supertokens from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import { supertokensConfig } from "./supertokens.ts";

const app = express();
app.use( express.json() );

supertokens.init( supertokensConfig );

app.use( cors( {
	origin: "http://localhost:3000",
	allowedHeaders: [ "content-type", ...supertokens.getAllCORSHeaders() ],
	methods: [ "GET", "PUT", "POST", "DELETE" ],
	credentials: true
} ) );

app.use( "/api", middleware() );
app.use( "/api", errorHandler() );

const supergraphSdl = await Bun.file( "./graphql/schema.graphql" ).text();
const gateway = new ApolloGateway( { supergraphSdl } );

const apolloServer = new ApolloServer( { gateway } );
await apolloServer.start();

const graphqlMiddleware = expressMiddleware( apolloServer, {
	context: async ( { req, res } ) => {
		return { req, res };
	}
} );

app.use( "/api/graphql", graphqlMiddleware );

const logger = createLogger( "Bootstrap" );

app.listen( 9000, () => {
	logger.info( "Gateway started on http://localhost:9000" );
} );

