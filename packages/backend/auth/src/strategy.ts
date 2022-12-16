import type { AppConfig } from "@shaastra/utils";
import type { Express } from "express";
import { passportJwtSecret } from "jwks-rsa";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from "passport-jwt";

export interface AuthPayload {
	iss?: string;
	sub?: string;
	aud?: string[];
	iat?: number;
	exp?: number;
	azp?: string;
	scope?: string;
	roles?: string[];
}

export interface UserAuthInfo {
	id: string;
	department: string;
	position: string;
}

function getStrategyOptions( config: AppConfig ): StrategyOptions {
	return {
		secretOrKeyProvider: passportJwtSecret( {
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: `http://${ config.auth?.domain }/api/keys`
		} ),
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		audience: config.auth?.audience,
		issuer: `http://${ config.auth?.domain }`,
		algorithms: [ "RS256" ]
	};
}

function verifyCallback( payload: AuthPayload ): UserAuthInfo {
	const departmentRole = payload.roles?.find( role => role.startsWith( "MEMBER_" ) )!;
	const positionRole = payload.roles?.find( role => role.startsWith( "POSITION_" ) )!;

	return {
		id: payload.sub!,
		department: departmentRole.substring( 7 ),
		position: positionRole.substring( 9 )
	};
}

export function registerAuth( app: Express, config: AppConfig ) {
	const jwtStrategy = new JwtStrategy( getStrategyOptions( config ), verifyCallback );
	passport.use( jwtStrategy );
	app.use( passport.initialize() );
}