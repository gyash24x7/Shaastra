import { RestApi } from "../rest/index.js";
import { join } from "node:path";
import process from "node:process";

export const graphiqlApi = new RestApi( {
	path: "/api/graphql",
	method: "GET",
	handler( { res } ) {
		res.sendFile( join( process.cwd(), "src/assets/graphiql.html" ) );
	}
} );