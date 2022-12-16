import type { GraphQLRequestContextWillSendResponse } from "@apollo/server";
import type { GatewayContext } from "@shaastra/utils";
import type { CookieOptions } from "express";

const accessTokenCookieOptions: CookieOptions = {
	maxAge: 9000000,
	httpOnly: true,
	domain: "localhost",
	path: "/",
	sameSite: "lax",
	secure: false
};

export function CookiePlugin() {
	return {
		async requestDidStart() {
			return {
				async willSendResponse( { contextValue }: GraphQLRequestContextWillSendResponse<GatewayContext> ) {
					if ( !!contextValue.token ) {
						contextValue.res.cookie( "identity", contextValue.token, accessTokenCookieOptions );
					}

					if ( contextValue.logout ) {
						contextValue.res.clearCookie( "identity" );
					}
				}
			};
		}
	};
}