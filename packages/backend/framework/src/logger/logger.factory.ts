import type { Type } from "@nestjs/common";
import { Ogma } from "@ogma/logger";
import { createWriteStream } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { LoggerService } from "./logger.service.js";

export class LoggerFactory {
	private static ogma = new Ogma( {
		logLevel: process.env[ "NODE_ENV" ] !== "production" ? "ALL" : "INFO",
		color: process.env[ "NODE_ENV" ] !== "production",
		json: process.env[ "NODE_ENV" ] === "production",
		stream: process.env[ "NODE_ENV" ] === "production"
			? createWriteStream( join( process.cwd(), `server.log` ) )
			: undefined
	} );

	static getLogger( scope?: Type | string ) {
		return new LoggerService( this.ogma, typeof scope === "string" ? scope : scope?.name );
	}
}