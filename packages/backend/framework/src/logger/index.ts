import { pino } from "pino";
import type { Request, Response } from "express";
import type { ExpressMiddleware } from "../auth/index.js";
import { pinoHttp } from "pino-http";

export const logger = pino( {
	level: process.env[ "NODE_ENV" ] === "production" ? "info" : "debug",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true
		}
	},
	customLogLevel( _req: Request, res: Response, err?: any ) {
		if ( res.statusCode >= 400 && res.statusCode < 500 ) {
			return "warn";
		} else if ( res.statusCode >= 500 || err ) {
			return "error";
		} else if ( res.statusCode >= 300 && res.statusCode < 400 ) {
			return "silent";
		}
		return "info";
	},
	customSuccessMessage( req: Request, res: Response ) {
		if ( res.statusCode === 404 ) {
			return "Resource not found!";
		}
		return `${ req.method } ${ req.path } Completed.`;
	},
	customReceivedMessage( req: Request, _res: Response ) {
		return `Request Received: ${ req.method } ${ req.path }`;
	},
	customErrorMessage( _req: Request, res: Response, _err: any ) {
		return `Request errored with status code:  ${ res.statusCode }`;
	}
} );

export const expressLoggingMiddleware: ExpressMiddleware = pinoHttp( { logger, autoLogging: false } );