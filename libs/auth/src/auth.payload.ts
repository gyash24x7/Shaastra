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