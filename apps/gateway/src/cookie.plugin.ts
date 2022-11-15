import type { ApolloServerPlugin, GraphQLRequestContextWillSendResponse } from "apollo-server-plugin-base";
import { Plugin } from "@nestjs/apollo";
import type { GqlContext } from "@shaastra/utils/graphql";
import type { CookieOptions } from "express";

const accessTokenCookieOptions: CookieOptions = {
	maxAge: 9000000,
	httpOnly: true,
	domain: "localhost",
	path: "/",
	sameSite: "lax",
	secure: false
};

@Plugin()
export class CookiePlugin implements ApolloServerPlugin<GqlContext> {
	async requestDidStart() {
		return {
			async willSendResponse( { context }: GraphQLRequestContextWillSendResponse<GqlContext> ) {
				if ( context.token ) {
					context.res.cookie( "identity", context.token, accessTokenCookieOptions );
				}

				if ( !!context.logout ) {
					context.res.clearCookie( "identity" );
				}
			}
		};
	}
}