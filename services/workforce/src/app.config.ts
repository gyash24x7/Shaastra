import { registerAs } from "@nestjs/config";

export default registerAs(
	"app",
	() => (
		{
			id: "workforce",
			name: "Shaastra Workforce",
			pkg: "@shaastra/workforce",
			port: 8010,
			address: "localhost",
			url: "http://localhost:8010",
			consul: {
				host: process.env[ "CONSUL_URL" ] || "localhost",
				port: process.env[ "CONSUL_PORT" ] || "8500"
			},
			prisma: {
				dbUrl: process.env[ "WORKFORCE_DB_URL" ]!
			},
			auth: {
				audience: process.env[ "AUTH_AUDIENCE" ]!,
				domain: process.env[ "AUTH_DOMAIN" ]!
			},
			mail: {
				sender: { name: "Shaastra Prime", email: "prime@shaastra.org" },
				apiKey: process.env[ "MAILJET_API_KEY" ]!,
				apiSecret: process.env[ "MAILJET_API_SECRET" ]!
			}
		}
	)
);
