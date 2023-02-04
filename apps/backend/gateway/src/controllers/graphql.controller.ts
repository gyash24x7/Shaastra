import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";
import { join } from "node:path";
import process from "node:process";

@Controller( "/api/graphql" )
export class GraphQLController {

	@Get()
	renderGraphiql( @Res() res: Response ) {
		res.sendFile( join( process.cwd(), "src/assets/graphiql.html" ) );
	}
}