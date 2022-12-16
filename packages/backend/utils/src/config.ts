import { capitalCase, constantCase } from "change-case";
import process from "node:process";

export type AuthConfig = {
	domain: string;
	audience: string;
	key?: {
		id?: string;
		passphrase?: string;
	}
};

export type MailConfig = {
	apiKey: string;
	apiSecret: string;
	sender: { email: string, name: string };
}

export type ConsulConfig = {
	host: string;
	port: string;
}

export type PrismaConfig = {
	dbUrl: string;
}

export type AppInfo = {
	id: string;
	name: string;
	url: string;
	pkg: string;
	port: number;
	address: string;
}

export type GatewayConfig = {
	services: string[]
}

export type AppConfig = AppInfo & {
	prisma?: PrismaConfig;
	consul: ConsulConfig;
	auth?: AuthConfig;
	mail?: MailConfig;
	gateway?: GatewayConfig;
}

export function generateAppConfig( id: string ): AppConfig {
	return {
		id,
		name: `Shaastra ${ capitalCase( id ) }`,
		pkg: `@shaastra/${ id }`,
		port: parseInt( process.env[ `${ constantCase( id ) }_PORT` ] || "8000" ),
		address: "localhost",
		url: "http://localhost:8000",
		consul: {
			host: process.env[ "CONSUL_URL" ] || "localhost",
			port: process.env[ "CONSUL_PORT" ] || "8500"
		},
		prisma: {
			dbUrl: process.env[ `${ constantCase( id ) }_DB_URL` ]!
		},
		auth: {
			audience: process.env[ "AUTH_AUDIENCE" ]!,
			domain: process.env[ "AUTH_DOMAIN" ]!,
			key: {
				id: process.env[ "AUTH_KEY_ID" ],
				passphrase: process.env[ "AUTH_KEY_PASSPHRASE" ]
			}
		},
		mail: {
			sender: { name: "Shaastra Prime", email: "prime@shaastra.org" },
			apiKey: process.env[ "MAILJET_API_KEY" ] || "",
			apiSecret: process.env[ "MAILJET_API_SECRET" ] || ""
		}
	};
}