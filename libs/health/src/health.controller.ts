import { Controller, Get, Inject } from "@nestjs/common";
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";

@Controller( "/api/health" )
export class HealthController {
	constructor(
		@Inject( "HEALTH_CONTROLLER_OPTIONS" ) private readonly options: { baseUrl: string },
		private readonly healthCheckService: HealthCheckService,
		private readonly httpHealthIndicator: HttpHealthIndicator
	) {}

	@Get()
	isHealthy() {
		return { healthy: true };
	}

	@Get( "/check" )
	@HealthCheck()
	healthCheck() {
		const url = `${ this.options.baseUrl }/api/health`;
		return this.healthCheckService.check( [
			() => this.httpHealthIndicator.pingCheck( "health-ping-check", url )
		] );
	}
}