import { registerAs } from "@nestjs/config";
import type { AppConfig } from "@shaastra/utils";

function appConfigFactory(): AppConfig {
	return {
		id: "gateway",
		name: "Shaastra Gateway",
		pkg: "@shaastra/gateway",
		port: 9000,
		address: "localhost",
		url: "http://localhost:9000",
		consul: {
			host: process.env[ "CONSUL_HOST" ] || "localhost",
			port: process.env[ "CONSUL_PORT" ] || "8500"
		},
		gateway: {
			services: [ "identity", "workforce", "connect" ]
		}
	};
}

export default registerAs( "app", appConfigFactory );