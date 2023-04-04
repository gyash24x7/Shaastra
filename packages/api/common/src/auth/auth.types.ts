import type { Department, MemberPosition } from "@prisma/client";

export type JWTPayload = {
	iss: string;
	sub: string;
	aud: string | string[];
	exp: number;
	iat: number;
	[ propName: string ]: unknown;
};

export type UserAuthInfo = {
	id: string;
	department?: Department;
	position?: MemberPosition;
};

export type JWTPayloadExtension = {
	id: string;
	roles: string[];
	verified: boolean;
};

export type AuthPayload = JWTPayloadExtension & JWTPayload;
