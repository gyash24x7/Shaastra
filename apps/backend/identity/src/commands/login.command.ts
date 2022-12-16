import type { PrismaClient } from "@prisma/client/identity/index.js";
import type { ICommand, ICommandHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import { generateAppConfig } from "@shaastra/utils";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import type { LoginInput } from "../graphql/inputs.js";
import { UserMessages } from "../messages/user.messages.js";


const config = generateAppConfig( "identity" );

const key = readFileSync( join( process.cwd(), "src/assets/.private.key" ) ).toString();
const passphrase = config.auth?.key?.passphrase!;

const jwtSignOptions: SignOptions = {
	audience: config.auth?.audience,
	algorithm: "RS256",
	issuer: `http://${ config.auth?.domain }`,
	keyid: config.auth?.key?.id
};

export class LoginCommand implements ICommand<LoginInput, ServiceContext<PrismaClient>> {

	constructor(
		public readonly data: LoginInput,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: ICommandHandler<LoginCommand, string> = async ( { data, context } ) => {
		const existingUser = await context.prisma.user.findUnique( {
			where: { username: data.username }
		} );

		if ( !existingUser ) {
			throw new Error( UserMessages.NOT_FOUND );
		}

		if ( !existingUser.verified ) {
			throw new Error( UserMessages.NOT_VERIFIED );
		}

		const doPasswordsMatch = bcrypt.compareSync( data.password, existingUser.password );
		if ( !doPasswordsMatch ) {
			throw new Error( UserMessages.INVALID_CREDENTIALS );
		}

		const token = jwt.sign(
			{ sub: existingUser.id, roles: existingUser.roles, verified: existingUser.verified },
			{ key, passphrase },
			jwtSignOptions
		);

		context.res.setHeader( "x-access-token", token );
		return token;
	};
}