import type { NextFunction, Request, Response } from "express";
import type { JwksClient } from "jwks-rsa";

export type ExpressMiddleware = ( req: Request, res: Response, next: NextFunction ) => unknown | Promise<unknown>

export const requireUser: ExpressMiddleware = function ( req: any, res, next ) {
	if ( !req.user ) {
		res.status( 403 ).send();
	} else {
		return next();
	}
};

function extractTokenFromRequest( req: Request ) {
	let token: string | undefined;
	const authHeader = req.headers.authorization;

	if ( authHeader ) {
		const matches = authHeader.match( /(\S+)\s+(\S+)/ );
		const authParams = matches && { scheme: matches[ 1 ], value: matches[ 2 ] };
		if ( authParams && "bearer" === authParams.scheme.toLowerCase() ) {
			token = authParams.value;
		}
	}
	return token;
}

// const  jwksClient= new JwksClient( {
// 	cache: true,
// 	rateLimit: true,
// 	jwksRequestsPerMinute: 5,
// 	jwksUri: `http://${ config.auth?.domain }/api/keys`
// } );

export function deserializeUser( jwksClient: JwksClient, _config: any ): ExpressMiddleware {
	return async ( req, _res, _next ) => {
		const token = extractTokenFromRequest( req );
		if ( token ) {
			// const { kid } = await jose.decodeProtectedHeader( token );
			// const signingKey = await jwksClient.getKeys();
			// const verifiedToken = jose.JWS.( token, signingKey.getPublicKey(), getJwtOptions( config ) );
		}


		jwksClient.getKeys();

	};
}