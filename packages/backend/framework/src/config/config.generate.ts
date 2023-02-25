import { capitalCase, constantCase } from "change-case";
import process from "node:process";
import type { AppConfig } from "./config.types";

export function generateConfig( id: string ): AppConfig {
	const address = process.env[ "APP_HOST" ] || "localhost";
	const port = parseInt( process.env[ `${ constantCase( id ) }_PORT` ] || "8000" );
	const isGateway = id === "gateway";
	const dbUrl = process.env[ `${ constantCase( id ) }_DB_URL` ]!;
	return {
		appInfo: {
			id,
			name: `Shaastra ${ capitalCase( id ) }`,
			address,
			url: `http://${ address }:${ port }`,
			port,
			pkg: `@app/${ id }`,
			isGateway
		},
		db: {
			url: dbUrl
		},
		auth: {
			audience: process.env[ "AUTH_AUDIENCE" ]!,
			domain: process.env[ "AUTH_DOMAIN" ]!,
			privateKeyPath: `assets/keys/.private.key`,
			publicKeyPath: `assets/keys/.public.key.pem`
		},
		redis: {
			host: process.env[ "REDIS_HOST" ] || address,
			port: parseInt( process.env[ "REDIS_PORT" ] || "6379" )
		},
		graphql: {
			schemaPath: `assets/schema.graphql`,
			graphRef: process.env[ "APOLLO_GRAPH_REF" ]!
		}
	};
}