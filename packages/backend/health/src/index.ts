import type { Express } from "express";
import * as process from "node:process";

export class HealthCheckController {
	register( app: Express ) {
		app.use( "/api/health", async ( _req, res, _next ) => {
			const healthcheck = {
				uptime: process.uptime(),
				responseTime: process.hrtime(),
				message: "OK",
				timestamp: Date.now()
			};
			try {
				res.send( healthcheck );
			} catch ( error: any ) {
				healthcheck.message = error.message;
				res.status( 503 ).send();
			}
		} );
	}
}