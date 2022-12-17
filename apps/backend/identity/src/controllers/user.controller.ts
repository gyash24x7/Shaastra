import type { PrismaClient } from "@prisma/client/identity/index.js";
import type { ServiceContextFn } from "@shaastra/utils";
import type { Express } from "express";
import { commandBus, CreateUserCommand } from "../commands/index.js";
import type { CreateUserInput } from "../commands/index.js";


export class UserController {
	register( app: Express, context: ServiceContextFn<PrismaClient> ) {
		app.post( "/api/users", async ( req, res ) => {
			const data: CreateUserInput = req.body;
			const ctx = await context({req,res});
			ctx.logger?.debug(`Context: ${JSON.stringify(ctx.)}`)
			return commandBus.execute( new CreateUserCommand( data, await context( { req, res } ) ) );
		} );
	}
}