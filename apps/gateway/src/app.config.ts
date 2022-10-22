import { registerAs } from "@nestjs/config";
import type { AppConfig } from "@shaastra/utils/config";

export default registerAs(
	"app",
	(): AppConfig => (
		{
			id: "gateway",
			name: "Shaastra Gateway",
			pkg: "@shaastra/gateway",
			port: 9000,
			address: "localhost",
			url: "http://localhost:9000",
			consul: {
				host: process.env[ "CONSUL_HOST" ] || "localhost",
				port: process.env[ "CONSUL_PORT" ] || "8500"
			}
		}
	)
);