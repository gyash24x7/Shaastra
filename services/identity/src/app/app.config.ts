import { registerAs } from "@nestjs/config";
import type { AppConfig } from "@shaastra/utils";

export default registerAs<AppConfig>( "app", () => ( {
	id: "identity",
	name: "Shaastra Identity",
	pkg: "@shaastra/identity",
	port: 8000,
	address: "localhost",
	url: "http://localhost:8000",
	consul: {
		host: process.env[ "CONSUL_URL" ] || "localhost",
		port: process.env[ "CONSUL_PORT" ] || "8500"
	},
	prisma: {
		dbUrl: process.env[ "IDENTITY_DB_URL" ]!
	},
	auth: {
		audience: process.env[ "AUTH0_AUDIENCE" ]!,
		domain: process.env[ "AUTH0_DOMAIN" ]!,
		clientId: "",
		clientSecret: ""
	}
} ) );
