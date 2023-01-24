import type { Request } from "express";
import { importJWK, importPKCS8, importSPKI, JWK, jwtVerify, SignJWT } from "jose";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import superagent from "superagent";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { AuthPayload, UserAuthInfo } from "../utils/index.js";
import { LoggerFactory } from "../logger/index.js";

@Injectable()
export class JwtService {
	private static readonly ALGORITHM = "RS256";
	private static readonly PRIVATE_KEY_PATH = "src/assets/keys/.private.key";
	private static readonly PUBLIC_KEY_PATH = "src/assets/keys/.public.key.pem";
	private readonly logger = LoggerFactory.getLogger( JwtService );

	private readonly domain: string;
	private readonly audience: string;

	constructor( readonly configService: ConfigService ) {
		this.domain = configService.getOrThrow( "app.auth.domain" );
		this.audience = configService.getOrThrow( "app.auth.audience" );
	}

	async getJwks() {
		const response = await superagent.get( `http://${ this.domain }/api/auth/keys` );
		const { keys } = response.body as { keys: JWK[] };
		return keys[ 0 ];
	}

	async getPrivateKey() {
		const privateKey = await readFile( join( process.cwd(), JwtService.PRIVATE_KEY_PATH ), "utf-8" );
		return importPKCS8( privateKey, JwtService.ALGORITHM );
	}

	async getPublicKey() {
		const publicKey = await readFile( join( process.cwd(), JwtService.PUBLIC_KEY_PATH ), "utf-8" );
		return importSPKI( publicKey, JwtService.ALGORITHM );
	}

	async sign( payload: { id: string, roles: string[], verified: boolean } ) {
		const privateKey = await this.getPrivateKey();

		return new SignJWT( payload )
			.setAudience( this.audience! )
			.setIssuedAt()
			.setExpirationTime( "1d" )
			.setIssuer( `http://${ this.domain }` )
			.setProtectedHeader( { alg: JwtService.ALGORITHM, typ: privateKey.type } )
			.setSubject( payload.id )
			.sign( privateKey );
	}

	async verify( token: string, isGateway: boolean = false ): Promise<UserAuthInfo | null> {
		const publicKey = !isGateway
			? await importJWK( await this.getJwks(), JwtService.ALGORITHM )
			: await this.getPublicKey();

		const { payload } = await jwtVerify(
			token,
			publicKey,
			{
				audience: this.audience,
				issuer: `http://${ this.domain }`,
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