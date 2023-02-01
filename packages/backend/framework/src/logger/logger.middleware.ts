import { constantCase } from "change-case";
import { green, yellow } from "colorette";
import type { ExpressMiddleware } from "../utils/index.js";
import { LoggerFactory } from "./logger.factory.js";

export function loggerMiddleware(): ExpressMiddleware {
	const logger = LoggerFactory.getLogger();
	return ( req, _res, next ) => {
		logger.info( `${ green( constantCase( req.method ) ) } ${ yellow( req.path ) }` );
		next();
	};
}