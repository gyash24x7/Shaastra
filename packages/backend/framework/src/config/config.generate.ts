import { constantCase, capitalCase } from "change-case";
import process from "node:process";
import type { AppConfig } from "../utils/index.js";

export function generateConfig( id: string ): AppConfig {
	const address = process.env[ "APP_HOST" ] || "localhost";
	const port = parseInt( process.env[ `${ constantCase( id ) }_PORT` ] || "8000" );
	const isGateway = id === "gateway";
	return {
		appInfo: {
			id,
			name: `Shaastra ${ capitalCase( id ) }`,
			address,
			url: `http://${ address }:${ port }`,
			port,
			pkg: `@shaastra/${ id }`,
			isGateway
		},
		auth: {
			audience: process.env[ "AUTH_AUDIENCE" ]!,
			domain: process.env[ "AUTH_DOMAIN" ]!,
			privateKeyPath: `src/assets/keys/.private.key`,
			publicKeyPath: `src/assets/keys/.public.key.pem`
		},
		redis: {
			host: process.env[ "REDIS_HOST" ] || address,
			port: parseInt( process.env[ "REDIS_PORT" ] || "6379" )
		},
		graphql: {
			schemaPath: `src/assets/schema.graphql`
		}
	};
}