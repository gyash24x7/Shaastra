import { Injectable } from "@nestjs/common";
import type { JwtOptionsFactory } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "fs";
import { join } from "path";
import type { Algorithm } from "jsonwebtoken";

@Injectable()
export class JwtConfigFactory implements JwtOptionsFactory {
	constructor( private readonly configService: ConfigService ) {
	}

	createJwtOptions() {
		const audience = this.configService.getOrThrow<string>( "app.auth.audience" );
		const issuer = `http://${ this.configService.getOrThrow<string>( "app.auth.domain" ) }`;
		const passphrase = this.configService.getOrThrow<string>( "app.auth.key.passphrase" );
		const algorithm: Algorithm = "RS256";
		const keyid = this.configService.getOrThrow<string>( "app.auth.key.id" );

		const key = readFileSync( join( __dirname, "assets", ".private.key" ) ).toString();
		return {
			privateKey: { key, passphrase },
			signOptions: { audience, algorithm, issuer, keyid },
			verifyOptions: { audience, algorithms: [ algorithm ], issuer }
		};
	}
}