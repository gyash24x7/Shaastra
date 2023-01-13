import { createTerminus } from "@godaddy/terminus";
import type { Server } from "http";
import { hrtime, uptime } from "node:process";
import type { Logger } from "pino";

export type HealthCheckResponse = {
	uptime: number;
	responseTime: [ number, number ];
	message?: string;
	timestamp: number;
}

export class HealthChecker {
	private readonly logger: Logger;

	constructor( httpServer: Server, logger: Logger ) {
		this.logger = logger;
		createTerminus( httpServer, {
			healthChecks: {
				"/api/health": this.healthApiHandler
			},
			onSignal: this.onSignal,
			logger: logger.error
		} );
	}

	async onSignal() {
		this.logger.warn( "Server is starting cleanup..." );
	}

	async healthApiHandler() {
		this.logger.trace( ">> HealthChecker::checkApiHealth()" );
		const healthCheck: HealthCheckResponse = {
			uptime: uptime(),
			responseTime: hrtime(),
			message: "OK",
			timestamp: Date.now()
		};

		this.logger.debug( "HealthCheckResponse: %o", healthCheck );
		this.logger.trace( "<< HealthChecker::checkApiHealth()" );
		return healthCheck;
	};
}