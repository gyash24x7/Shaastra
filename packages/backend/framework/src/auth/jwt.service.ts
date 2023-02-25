import { Injectable } from "@nestjs/common";
import type { Request } from "express";
import { importJWK, importPKCS8, importSPKI, JWK, jwtVerify, SignJWT } from "jose";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import superagent from "superagent";
import { AppConfig, Config } from "../config";
import { LoggerFactory } from "../logger";
import type { AuthPayload, UserAuthInfo } from "./auth.types";

@Injectable()
export class JwtService {
	public static readonly ALGORITHM = "RS256";
	private readonly logger = LoggerFactory.getLogger( JwtService );

	constructor( @Config() private readonly config: AppConfig ) {}

	async getJwks() {
		const response = await superagent.get( `${ this.config.appInfo.url }/api/auth/keys` );
		const { keys } = response.body as { keys: JWK[] };
		return keys[ 0 ];
	}

	async getPrivateKey() {
		const privateKey = await readFile( join( __dirname, this.config.auth.privateKeyPath ), "utf-8" );
		return importPKCS8( privateKey, JwtService.ALGORITHM );
	}

	async getPublicKey() {
		const publicKey = await readFile( join( __dirname, this.config.auth.publicKeyPath ), "utf-8" );
		return importSPKI( publicKey, JwtService.ALGORITHM );
	}

	async sign( payload: { id: string, roles: string[], verified: boolean } ) {
		const privateKey = await this.getPrivateKey();

		return new SignJWT( payload )
			.setAudience( this.config.auth.audience )
			.setIssuedAt()
			.setExpirationTime( "1d" )
			.setIssuer( `http://${ this.config.auth.domain }` )
			.setProtectedHeader( { alg: JwtService.ALGORITHM, typ: privateKey.type } )
			.setSubject( payload.id )
			.sign( privateKey );
	}

	async verify( token: string ): Promise<UserAuthInfo | null> {
		const publicKey = this.config.appInfo.id !== "gateway"
			? await importJWK( await this.getJwks(), JwtService.ALGORITHM )
			: await this.getPublicKey();

		const { payload } = await jwtVerify(
			token,
			publicKey,
			{
				audience: this.config.auth.audience,
				issuer: `http://${ this.config.auth.domain }`,
				algorithms: [ JwtService.ALGORITHM ]
			}
		).catch( () => {
			this.logger.error( "Error Verifying Token!" );
			return { payload: null };
		} );

		if ( !payload ) {
			return null;
		}

		const authPayload = { ...payload as AuthPayload };
		const departmentRole = authPayload.roles.find( role => role.startsWith( "MEMBER_" ) )!;
		const positionRole = authPayload.roles.find( role => role.startsWith( "POSITION_" ) )!;

		return {
			id: authPayload.sub!,
			department: departmentRole.substring( 7 ),
			position: positionRole.substring( 9 )
		};
	}

	extractTokenFromRequestHeaders( req: Request ) {
		let token: string | undefined;
		const authHeader = req.headers.authorization;

		if ( authHeader ) {
			const [ scheme, tokenInHeader ] = authHeader.split( " " );
			if ( scheme.toLowerCase() === "bearer" && !!tokenInHeader ) {
				token = tokenInHeader;
			}
		}
		return token;
	}
}