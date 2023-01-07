import { pino } from "pino";
import { pinoHttp } from "pino-http";
import type { ExpressMiddleware } from "../application/index.js";

export const logger = pino( {
	level: process.env[ "NODE_ENV" ] === "production" ? "info" : "debug",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true
		}
	}
} );

export function expressLoggingMiddleware(): ExpressMiddleware {
	return pinoHttp( { logger, autoLogging: false } );
}