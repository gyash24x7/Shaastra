import { registerAs } from "@nestjs/config";
import type { AppConfig } from "@shaastra/utils";

async function appConfigFactory(): Promise<AppConfig> {
	return {
		id: "connect",
		name: "Shaastra Connect",
		pkg: "@shaastra/connect",
		port: 8020,
		address: "localhost",
		url: "http://localhost:8020",
		consul: {
			host: process.env[ "CONSUL_URL" ] || "localhost",
			port: process.env[ "CONSUL_PORT" ] || "8500"
		},
		prisma: {
			dbUrl: process.env[ "CONNECT_DB_URL" ]!
		},
		auth: {
			audience: process.env[ "AUTH_AUDIENCE" ]!,
			domain: process.env[ "AUTH_DOMAIN" ]!
		}
	};
}

export default registerAs( "app", appConfigFactory );
