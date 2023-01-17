import type { Request } from "express";
import { importJWK, importPKCS8, importSPKI, JWK, JWTPayload, jwtVerify, SignJWT } from "jose";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import type { Logger } from "pino";
import superagent from "superagent";

export interface JWTPayloadExtension {
	id: string,
	roles: string[],
	verified: boolean
}

export interface JwtUtilsConfig {
	audience: string;
	domain: string;
	privateKeyPath?: string;
	publicKeyPath?: string;
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

	constructor( private readonly config: JwtUtilsConfig, private readonly logger: Logger ) {}

	async getJwks() {
		const response = await superagent.get( `http://${ this.config.domain }/api/auth/keys` );
		const { keys } = response.body as { keys: JWK[] };
		return keys[ 0 ];
	}

	async getPrivateKey() {
		const privateKeyPath = this.config.privateKeyPath || JwtUtils.PRIVATE_KEY_PATH;
		const privateKey = await readFile( join( process.cwd(), privateKeyPath ), "utf-8" );
		return importPKCS8( privateKey, JwtUtils.ALGORITHM );
	}

	async getPublicKey() {
		const publicKeyPath = this.config.publicKeyPath || JwtUtils.PUBLIC_KEY_PATH;
		const publicKey = await readFile( join( process.cwd(), publicKeyPath ), "utf-8" );
		return importSPKI( publicKey, JwtUtils.ALGORITHM );
	}

	async signOpaqueToken( id: string ) {
		const privateKey = await this.getPrivateKey();

		return new SignJWT( {} )
			.setAudience( this.config.audience! )
			.setIssuedAt()
			.setExpirationTime( "1d" )
			.setIssuer( `http://${ this.config.domain }` )
			.setProtectedHeader( { alg: JwtUtils.ALGORITHM, typ: privateKey.type } )
			.setSubject( id )
			.sign( privateKey );
	}

	async sign( payload: { id: string, roles: string[], verified: boolean } ) {
		const privateKey = await this.getPrivateKey();

		return new SignJWT( payload )
			.setAudience( this.config.audience! )
			.setIssuedAt()
			.setExpirationTime( "1m" )
			.setIssuer( `http://${ this.config.domain }` )
			.setProtectedHeader( { alg: JwtUtils.ALGORITHM, typ: privateKey.type } )
			.setSubject( payload.id )
			.sign( privateKey );
	}

	async verifyOpaqueToken( token: string ) {
		const publicKey = await this.getPublicKey();

		const { payload } = await jwtVerify(
			token,
			publicKey,
			{
				audience: this.config.audience,
				issuer: `http://${ this.config.domain }`,
				algorithms: [ JwtUtils.ALGORITHM ]
			}
		).catch( () => {
			this.logger.error( "Error Verifying Token!" );
			return { payload: null };
		} );

		return payload;
	}

	async verify( token: string ): Promise<UserAuthInfo | undefined> {
		const publicKey = await importJWK( await this.getJwks(), JwtUtils.ALGORITHM );

		const { payload } = await jwtVerify(
			token,
			publicKey,
			{
				audience: this.config.audience,
				issuer: `http://${ this.config.domain }`,
				algorithms: [ JwtUtils.ALGORITHM ]
			}
		).catch( () => {
			this.logger.error( "Error Verifying Token!" );
			return { payload: null };
		} );

		const authPayload = { ...payload as AuthPayload };

		const departmentRole = authPayload.roles.find( role => role.startsWith( "MEMBER_" ) )!;
		const positionRole = authPayload.roles.find( role => role.startsWith( "POSITION_" ) )!;

		return {
			id: authPayload.sub!,
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
}