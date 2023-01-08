import { createTerminus } from "@godaddy/terminus";
import type { Server } from "http";
import { hrtime, uptime } from "node:process";
import type { AppInfo } from "../application/index.js";
import type { Consul } from "../consul/index.js";
import { logger } from "../logger/index.js";

export type HealthCheckResponse = {
	uptime: number;
	responseTime: [ number, number ];
	message?: string;
	timestamp: number;
}

export class HealthChecker {
	private readonly consul: Consul;
	private readonly appInfo: AppInfo;

	constructor( httpServer: Server, consul: Consul, appInfo: AppInfo ) {
		this.consul = consul;
		this.appInfo = appInfo;

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
		await this.consul.deregisterService( this.appInfo.id );
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