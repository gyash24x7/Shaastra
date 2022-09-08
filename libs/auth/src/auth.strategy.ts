import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy as BaseStrategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import type { AuthPayload } from "./auth.payload";
import type { AuthStrategyOptions } from "./auth.options";

@Injectable()
export class AuthStrategy extends PassportStrategy( BaseStrategy ) {
	constructor( @Inject( "AUTH_STRATEGY_OPTIONS" ) { domain, audience }: AuthStrategyOptions ) {
		super( {
			secretOrKeyProvider: passportJwtSecret( {
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 5,
				jwksUri: `https://${ domain }/.well-known/jwks.json`
			} ),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			audience,
			issuer: `https://${ domain }/`,
			algorithms: [ "RS256" ]
		} );
	}

	validate( payload: AuthPayload ): AuthPayload {
		return payload;
	}
}