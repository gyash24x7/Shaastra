import { AppCommands, CreateUserInput } from "../commands/index.js";
import { RestApi } from "@shaastra/framework";

export const userRestApi = new RestApi( {
	method: "POST",
	path: "/api/users",
	async handler( context ) {
		const data: CreateUserInput = context.req.body;
		const userId: string = await context.commandBus.execute( AppCommands.CREATE_USER_COMMAND, data, context );
		context.res.send( userId );
	}
} );