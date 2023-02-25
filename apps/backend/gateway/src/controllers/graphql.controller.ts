import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";
import { join } from "node:path";

@Controller( "/api/graphql" )
export class GraphQLController {

	@Get()
	renderGraphiql( @Res() res: Response ) {
		res.sendFile( join( __dirname, "assets/graphiql.html" ) );
	}
}