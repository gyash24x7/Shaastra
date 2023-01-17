import { pino, type Logger } from "pino";
import { pinoHttp } from "pino-http";
import type { ExpressMiddlewareFn } from "../application/index.js";

export function createLogger() {
	return pino( {
		level: process.env[ "NODE_ENV" ] === "production" ? "info" : "debug",
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true
			}
		}

	} );
}

export function expressLoggingMiddleware( logger: Logger ): ExpressMiddlewareFn {
	return pinoHttp( { logger } );
}