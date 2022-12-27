import { AppCommands, CreateUserInput } from "../commands/index.js";
import { RestApi } from "@shaastra/framework";
import type { AppContext } from "../index.js";

export const userRestApi = new RestApi<AppContext>( {
	method: "POST",
	path: "/api/users",
	async handler( context ) {
		const data: CreateUserInput = context.req.body;
		const userId: string = await context.commandBus.execute( AppCommands.CREATE_USER_COMMAND, data, context );
		context.res.send( userId );
	}
} );