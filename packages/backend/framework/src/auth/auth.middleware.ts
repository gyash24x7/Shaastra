import type { ExpressMiddleware } from "../utils/index.js";
import type { JwtService } from "./jwt.service.js";

export function deserializeAuthInfo( jwtService: JwtService, isGateway: boolean = false ): ExpressMiddleware {
	return async ( req, res, next ) => {
		const token = isGateway
			? req.cookies[ "identity" ]
			: jwtService.extractTokenFromRequestHeaders( req );

		if ( token ) {
			const authInfo = await jwtService.verify( token, isGateway );

			if ( authInfo ) {
				res.locals[ "authInfo" ] = authInfo;
			}
		}

		next();
	};
}