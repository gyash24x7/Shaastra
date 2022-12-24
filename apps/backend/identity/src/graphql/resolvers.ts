import { AppCommands } from "../commands/index.js";
import type { Resolvers } from "./generated/index.js";

export const resolvers: Resolvers = {
	Mutation: {
		async login( _parent, { data }, context ): Promise<boolean> {
			return context.commandBus.execute( AppCommands.LOGIN_COMMAND, data, context );
		},

		async verifyUser( _parent, { data }, context ) {
			return context.commandBus.execute( AppCommands.VERIFY_USER_COMMAND, data, context );
		},

		async logout( _parent, _args, { authInfo, res } ) {
			res.setHeader( "x-logout", authInfo!.id );
			return true;
		}
	}
};