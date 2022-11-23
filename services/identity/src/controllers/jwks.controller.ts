import { Controller, Get, Logger } from "@nestjs/common";
import fs from "fs";
import { pem2jwk } from "pem-jwk";
import path from "path";

@Controller( "/api/keys" )
export class JwksController {
	private readonly logger = new Logger( JwksController.name );

	@Get()
	async getJwksKeys() {
		this.logger.debug( ">> JwksController::getJwksKeys()" );
		const pem = fs.readFileSync( path.join( __dirname, "assets", ".public.key.pem" ) );
		const jwk = pem2jwk( pem.toString() );
		this.logger.debug( "<< JwksController::getJwksKeys()" );
		return { keys: [ { ...jwk, kid: process.env[ "AUTH_KEY_ID" ]!, use: "sig" } ] };
	}
}