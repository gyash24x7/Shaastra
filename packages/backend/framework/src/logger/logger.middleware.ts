import type { ExpressMiddleware } from "../utils/index.js";
import { constantCase } from "change-case";
import { bgWhite, italic } from "colorette";
import { LoggerFactory } from "./logger.factory.js";

export function loggerMiddleware(): ExpressMiddleware {
	const logger = LoggerFactory.getLogger();
	return ( req, _res, next ) => {
		logger.info( `[${ bgWhite( constantCase( req.method ) ) }] [${ italic( req.path ) }]` );
		next();
	};
}