import { LoginCommand, VerifyUserCommand } from "../commands/index.js";
import type { Resolvers } from "./generated/index.js";

export const resolvers: Resolvers = {
	Mutation: {
		async login( _parent, { data }, context ) {
			return context.commandBus.execute( new LoginCommand( data, context ) );
		},

		async verifyUser( _parent, { data }, context ) {
			return context.commandBus.execute( new VerifyUserCommand( data, context ) );
		},

		async logout( _parent, _args, { authInfo, res } ) {
			res.setHeader( "x-logout", authInfo!.id );
			return true;
		}
	}
};