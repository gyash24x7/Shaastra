import type { Type } from "@nestjs/common";
import { Ogma } from "@ogma/logger";
import process from "node:process";
import { LoggerService } from "./logger.service";

export class LoggerFactory {
	private static application: string;

	private static ogma = new Ogma( {
		logLevel: "ALL",
		color: process.env[ "NODE_ENV" ] !== "production",
		json: process.env[ "NODE_ENV" ] === "production"
	} );

	static getLogger( scope?: Type ) {
		return new LoggerService( this.ogma, this.application, scope?.name );
	}

	static setAppName( application: string ) {
		this.application = application;
	}
}