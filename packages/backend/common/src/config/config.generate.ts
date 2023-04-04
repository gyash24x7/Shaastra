import { createId } from "@paralleldrive/cuid2";
import process from "node:process";
import type { AppConfig } from "./config.types";

export function generateConfig(): AppConfig {
	const address = process.env[ "APP_HOST" ] || "localhost";
	const port = parseInt( process.env[ "APP_PORT" ] || "8000" );
	const dbUrl = process.env[ "DATABASE_URL" ];
	return {
		appInfo: {
			id: createId(),
			name: "Fest Application",
			address,
			url: `http://${ address }:${ port }`,
			port
		},
		db: {
			url: dbUrl ?? ""
		},
		auth: {
			audience: process.env[ "AUTH_AUDIENCE" ] ?? "",
			domain: process.env[ "AUTH_DOMAIN" ] ?? "",
			privateKeyPath: "assets/keys/.private.key",
			publicKeyPath: "assets/keys/.public.key.pem"
		}
	};
}
