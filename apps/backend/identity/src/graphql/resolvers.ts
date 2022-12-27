import { logger } from "@shaastra/framework";
import { AppCommands } from "../commands/index.js";
import type { Resolvers } from "./generated/index.js";

export const resolvers: Resolvers = {
	Mutation: {
		async login( _parent, { data }, context ): Promise<boolean> {
			logger.trace( `>> Resolvers::Mutation::login()` );
			logger.debug( "Data: ", data );

			return context.commandBus.execute( AppCommands.LOGIN_COMMAND, data, context );
		},

		async verifyUser( _parent, { data }, context ): Promise<string> {
			logger.trace( `>> Resolvers::Mutation::verifyUser()` );
			logger.debug( "Data: ", data );

			return context.commandBus.execute( AppCommands.VERIFY_USER_COMMAND, data, context );
		},

		async logout( _parent, _args, { authInfo, res } ): Promise<boolean> {
			logger.trace( `>> Resolvers::Mutation::logout()` );

			res.setHeader( "x-logout", authInfo!.id );
			return true;
		}
	}
};