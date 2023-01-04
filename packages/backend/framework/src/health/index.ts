import type { Server } from "http";
import { createTerminus } from "@godaddy/terminus";
import { logger } from "../logger/index.js";
import { hrtime, uptime } from "node:process";
import type { Consul } from "../consul/index.js";
import type { AppInfo } from "../application/index.js";

export type HealthCheckResponse = {
	uptime: number;
	responseTime: [ number, number ];
	message?: string;
	timestamp: number;
}

export class HealthCheck {
	constructor( httpServer: Server, consul: Consul, appInfo: AppInfo ) {
		createTerminus( httpServer, {
			healthChecks: {
				"/api/health": async () => {
					logger.trace( ">> HealthChecker::checkApiHealth()" );
					const healthCheck: HealthCheckResponse = {
						uptime: uptime(),
						responseTime: hrtime(),
						message: "OK",
						timestamp: Date.now()
					};

					logger.debug( "HealthCheckResponse: %o", healthCheck );
					logger.trace( "<< HealthChecker::checkApiHealth()" );
					return healthCheck;
				}
			},
			onSignal: async () => {
				logger.warn( "Server is starting cleanup..." );
				await consul.deregisterService( appInfo.id );
			},
			logger: logger.error
		} );
	}
}