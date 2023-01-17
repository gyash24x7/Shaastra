import type { ExpressMiddlewareFn } from "../application/index.js";
import type { JwtUtils } from "./jwt.js";

export function deserializeUser( jwtUtils: JwtUtils ): ExpressMiddlewareFn {
	return async ( req, res, next ) => {
		const opaqueToken = !!req.cookies ? req.cookies[ "identity" ] : undefined;
		console.log( `Opaque Token: ${ opaqueToken }` );
		if ( !!opaqueToken ) {
			res.locals[ "userId" ] = await jwtUtils.verifyOpaqueToken( opaqueToken ).then( payload => payload?.sub );
		} else {
			const claimsToken = jwtUtils.extractTokenFromRequest( req );
			console.log( `Claims Token: ${ claimsToken }` );
			if ( !!claimsToken ) {
				res.locals[ "authInfo" ] = await jwtUtils.verify( claimsToken );
			}
		}

		next();
	};
}

export function requireUser(): ExpressMiddlewareFn {
	return async ( _req, res, next ) => {
		if ( !res.locals[ "userId" ] ) {
			res.status( 401 ).send();
		} else {
			next();
		}
	};
}