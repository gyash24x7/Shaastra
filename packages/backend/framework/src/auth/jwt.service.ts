import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import { importJWK, importPKCS8, importSPKI, JWK, jwtVerify, SignJWT } from "jose";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import superagent from "superagent";
import { LoggerFactory } from "../logger/index.js";
import type { AuthPayload, UserAuthInfo } from "../utils/index.js";

@Injectable()
export class JwtService {
	private static readonly ALGORITHM = "RS256";
	private readonly logger = LoggerFactory.getLogger( JwtService );

	private readonly domain: string;
	private readonly audience: string;
	private readonly privateKeyPath: string;
	private readonly publicKeyPath: string;

	constructor( readonly configService: ConfigService ) {
		this.domain = configService.getOrThrow( "app.auth.domain" );
		this.audience = configService.getOrThrow( "app.auth.audience" );
		this.privateKeyPath = configService.getOrThrow( "app.auth.privateKeyPath" );
		this.publicKeyPath = configService.getOrThrow( "app.auth.publicKeyPath" );
	}

	async getJwks() {
		const response = await superagent.get( `http://${ this.domain }/api/auth/keys` );
		const { keys } = response.body as { keys: JWK[] };
		return keys[ 0 ];
	}

	async getPrivateKey() {
		const privateKey = await readFile( join( process.cwd(), this.privateKeyPath ), "utf-8" );
		return importPKCS8( privateKey, JwtService.ALGORITHM );
	}

	async getPublicKey() {
		const publicKey = await readFile( join( process.cwd(), this.publicKeyPath ), "utf-8" );
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