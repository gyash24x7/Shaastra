export type JWTPayload = {
	iss?: string;
	sub?: string;
	aud?: string | string[];
	jti?: string;
	nbf?: number;
	exp?: number;
	iat?: number;
	[ propName: string ]: unknown
}

export type UserAuthInfo = {
	id: string;
	department?: string;
	position?: string;
}

export type JWTPayloadExtension = {
	id: string,
	roles: string[],
	verified: boolean
}

export type AuthPayload = JWTPayloadExtension & JWTPayload;