import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy as BaseStrategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import type { AuthPayload } from "./auth.payload";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthStrategy extends PassportStrategy( BaseStrategy ) {
	constructor( configService: ConfigService ) {
		super( {
			secretOrKeyProvider: passportJwtSecret( {
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 5,
				jwksUri: `https://${ configService.get<string>( "app.auth.audience" )! }/.well-known/jwks.json`
			} ),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			audience: configService.get<string>( "app.auth.audience" )!,
			issuer: `https://${ configService.get<string>( "app.auth.audience" )! }/`,
			algorithms: [ "RS256" ]
		} );
	}

	validate( payload: AuthPayload ): AuthPayload {
		return payload;
	}
}