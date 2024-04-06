import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { type AuthContext, createLogger } from "@backend/utils";
import { schema } from "@equip/schema";
import cors from "cors";
import express from "express";

const app = express();
app.use( express.json() );
app.use( cors() );

const apolloServer = new ApolloServer<AuthContext>( { schema } );
await apolloServer.start();

const graphqlMiddleware = expressMiddleware<AuthContext>( apolloServer, {
	context: async ( { req, res } ) => {
		const authInfo = res.locals[ "user" ];
		return { req, res, authInfo };
	}
} );

app.use( "/api/graphql", graphqlMiddleware );

const logger = createLogger( "Bootstrap" );

app.listen( 8010, () => {
	logger.info( "Equip started on http://localhost:8010" );
} );