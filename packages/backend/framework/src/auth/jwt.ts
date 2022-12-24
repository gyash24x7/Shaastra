import {
	exportPKCS8,
	exportSPKI,
	generateKeyPair,
	importJWK,
	importPKCS8,
	importSPKI,
	JWK,
	JWTPayload,
	jwtVerify,
	SignJWT
} from "jose";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import got from "got";

export interface JWTPayloadExtension {
	id?: string,
	roles?: string[],
	verified?: boolean
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

	constructor( private readonly config: any ) {}

	async getJwks() {
		const { keys } = await got.get( `http://${ this.config.auth?.domain }/api/keys` ).json<{ keys: JWK[] }>();
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

	async generateAuthKeys() {
		const { privateKey, publicKey } = await generateKeyPair( JwtUtils.ALGORITHM );
		await writeFile( join( process.cwd(), JwtUtils.PRIVATE_KEY_PATH ), await exportPKCS8( privateKey ) );
		await writeFile( join( process.cwd(), JwtUtils.PUBLIC_KEY_PATH ), await exportSPKI( publicKey ) );
	}

	async sign( payload: { id: string, roles: string[], verified: boolean } ) {
		const privateKey = await this.getPrivateKey();

		return new SignJWT( payload )
			.setAudience( this.config.auth?.audience! )
			.setIssuedAt()
			.setExpirationTime( "1d" )
			.setIssuer( `http://${ this.config.auth?.domain }` )
			.setProtectedHeader( { alg: JwtUtils.ALGORITHM } )
			.setSubject( payload.id )
			.sign( privateKey );
	}

	async verify( token: string ): Promise<UserAuthInfo> {
		const publicKey = await importJWK( await this.getJwks(), JwtUtils.ALGORITHM );

		const { payload } = await jwtVerify(
			token,
			publicKey,
			{
				audience: this.config.auth?.audience,
				issuer: `http://${ this.config.auth?.domain }`,
				algorithms: [ JwtUtils.ALGORITHM ]
			}
		);

		const authPayload: AuthPayload = { ...payload };

		const departmentRole = authPayload.roles?.find( role => role.startsWith( "MEMBER_" ) )!;
		const positionRole = authPayload.roles?.find( role => role.startsWith( "POSITION_" ) )!;

		return {
			id: payload.sub!,
			department: departmentRole.substring( 7 ),
			position: positionRole.substring( 9 )
		};
	}
}