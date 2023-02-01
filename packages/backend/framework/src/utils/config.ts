import { capitalCase, constantCase } from "change-case";
import process from "node:process";
import type { AppConfig, AppInfo } from "./types.js";

export function generateAppInfo( id: string ): AppInfo {
	const port = parseInt( process.env[ `${ constantCase( id ) }_PORT` ] || "8000" );
	const name = `Shaastra ${ capitalCase( id ) }`;
	const pkg = `@shaastra/${ id }`;
	const address = process.env[ "APP_HOST" ] || "localhost";
	const url = `http://${ address }:${ port }`;
	return { id, name, pkg, port, address, url };
}

export function appConfigFactory( id: string ): () => AppConfig {
	const appInfo = generateAppInfo( id );
	return () => (
		{
			...appInfo,
			auth: {
				audience: process.env[ "AUTH_AUDIENCE" ]!,
				domain: process.env[ "AUTH_DOMAIN" ]!,
				privateKeyPath: `src/assets/keys/.private.key`,
				publicKeyPath: `src/assets/keys/.public.key.pem`
			},
			redis: {
				host: process.env[ "REDIS_HOST" ]!,
				port: parseInt( process.env[ "REDIS_PORT" ]! )
			},
			graphql: {
				schemaPath: `src/assets/schema.graphql`
			}
		}
	);
}