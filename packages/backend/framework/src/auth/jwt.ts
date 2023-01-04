import {
	createRemoteJWKSet,
	importJWK,
	importPKCS8,
	importSPKI,
	JWK,
	jwtDecrypt,
	JWTPayload,
	jwtVerify,
	SignJWT
} from "jose";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import got from "got";
import type { Request } from "express";
import { logger } from "../logger/index.js";

export interface JWTPayloadExtension {
	id?: string,
	roles?: string[],
	verified?: boolean
}

export interface JwtUtilsConfig {
	audience: string;
	domain: string;
}

export type AuthPayload = JWTPayloadExtension & JWTPayload;

export interface UserAuthInfo {
	id: string;
	department: string;
	position: string;
}

export class JwtUtils {
	private static readonly ALGORITHM = "RS256";
	private static readonly PRIVATE_KEY_PATH = "src/assets/keys/.private.key";
	private static readonly PUBLIC_KEY_PATH = "src/assets/keys/.public.key.pem";

	constructor( private readonly config: JwtUtilsConfig ) {}

	async getJwks() {
		const { keys } = await got.get( `http://${ this.config.domain }/api/keys` ).json<{ keys: JWK[] }>();
		return keys[ 0 ];
	}

	async getPrivateKey() {
		const privateKey = await readFile( join( process.cwd(), JwtUtils.PRIVATE_KEY_PATH ), "utf-8" );
		return importPKCS8( privateKey, JwtUtils.ALGORITHM );
	}

	async getPublicKey() {
		const publicKey = await readFile( join( process.cwd(), JwtUtils.PUBLIC_KEY_PATH ), "utf-8" );
		return importSPKI( publicKey, JwtUtils.ALGORITHM );
	}

	async sign( payload: { id: string, roles: string[], verified: boolean } ) {
		const privateKey = await this.getPrivateKey();

		return new SignJWT( payload )
			.setAudience( this.config.audience! )
			.setIssuedAt()
			.setExpirationTime( "1d" )
			.setIssuer( `http://${ this.config.domain }` )
			.setProtectedHeader( { alg: JwtUtils.ALGORITHM, typ: privateKey.type } )
			.setSubject( payload.id )
			.sign( privateKey );
	}

	async verify( token: string ): Promise<UserAuthInfo | undefined> {
		const publicKey = await importJWK( await this.getJwks(), JwtUtils.ALGORITHM );

		let authPayload: AuthPayload | undefined;


		try {
			const { payload } = await jwtVerify(
				token,
				publicKey,
				{
					audience: this.config.audience,
					issuer: `http://${ this.config.domain }`,
					algorithms: [ JwtUtils.ALGORITHM ]
				}
			);

			authPayload = { ...payload };
		} catch ( e ) {
			logger.error( "Error Verifying Token!" );
			return;
		}

		const departmentRole = authPayload?.roles?.find( role => role.startsWith( "MEMBER_" ) )!;
		const positionRole = authPayload?.roles?.find( role => role.startsWith( "POSITION_" ) )!;

		return {
			id: authPayload?.sub!,
			department: departmentRole.substring( 7 ),
			position: positionRole.substring( 9 )
		};
	}

	extractTokenFromRequest( req: Request ) {
		let token: string | undefined;
		const authHeader = req.headers.authorization;

		if ( authHeader ) {
			const matches = authHeader.match( /(\S+)\s+(\S+)/ );
			const authParams = matches && { scheme: matches[ 1 ], value: matches[ 2 ] };
			if ( authParams && "bearer" === authParams.scheme.toLowerCase() ) {
				token = authParams.value;
			}
		}
		return token;
	}

	async deserializeUser( token: string ): Promise<JWTPayload> {
		const url = new URL( `http://${ this.config.domain }/api/keys` );
		const jwks: any = createRemoteJWKSet( url );

		const { payload } = await jwtDecrypt( token, jwks );
		return payload;
	}
}