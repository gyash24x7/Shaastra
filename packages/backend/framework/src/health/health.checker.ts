import { createTerminus } from "@godaddy/terminus";
import type { Server } from "http";
import { hrtime, uptime } from "node:process";
import { logger } from "../logger/index.js";

export type HealthCheckResponse = {
	uptime: number;
	responseTime: [ number, number ];
	message?: string;
	timestamp: number;
}

export class HealthChecker {

	constructor( httpServer: Server ) {
		createTerminus( httpServer, {
			healthChecks: {
				"/api/health": this.healthApiHandler
			},
			onSignal: this.onSignal,
			logger: logger.error
		} );
	}

	async onSignal() {
		logger.warn( "Server is starting cleanup..." );
	}

	async healthApiHandler() {
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
	};
}