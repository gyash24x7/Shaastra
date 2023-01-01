import { pino } from "pino";
import type { ExpressMiddleware } from "../auth/index.js";
import { pinoHttp } from "pino-http";

export const logger = pino( {
	level: process.env[ "NODE_ENV" ] === "production" ? "info" : "debug",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true
		}
	}
} );

export const expressLoggingMiddleware: ExpressMiddleware = pinoHttp( { logger, autoLogging: false } );