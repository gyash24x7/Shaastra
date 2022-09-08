import { registerAs } from "@nestjs/config";
import type { AppConfig } from "@shaastra/utils";

export default registerAs<AppConfig>( "app", () => ( {
	id: "workforce",
	name: "Shaastra Workforce",
	pkg: "@shaastra/workforce",
	port: 8000,
	address: "localhost",
	url: "http://localhost:8000",
	auth: {
		domain: process.env[ "AUTH0_DOMAIN" ]!,
		clientId: process.env[ "AUTH0_CLIENT_ID" ]!,
		clientSecret: process.env[ "AUTH0_CLIENT_SECRET" ]!,
		audience: process.env[ "AUTH0_AUDIENCE" ]!
	},
	consul: {
		host: process.env[ "CONSUL_URL" ] || "localhost",
		port: process.env[ "CONSUL_PORT" ] || "8500"
	},
	prisma: {
		dbUrl: process.env[ "WORKFORCE_DB_URL" ]!
	}
} ) );
