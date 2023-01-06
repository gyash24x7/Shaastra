import type { JwtUtils } from "./jwt";
import type { ExpressMiddleware } from "../application";

export function deserializeUser( jwtUtils: JwtUtils ): ExpressMiddleware {
	return async ( req, res, next ) => {
		const token = jwtUtils.extractTokenFromRequest( req );
		if ( token ) {
			res.locals[ "authInfo" ] = await jwtUtils.verify( token );
		}
		next();
	};
}
