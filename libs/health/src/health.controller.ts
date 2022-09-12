import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";
import { ConfigService } from "@nestjs/config";

@Controller( "/api/health" )
export class HealthController {
	constructor(
		private readonly configService: ConfigService,
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
		const url = `${ this.configService.get<string>( "app.url" ) }/api/health`;
		return this.healthCheckService.check( [
			() => this.httpHealthIndicator.pingCheck( "health-ping-check", url )
		] );
	}
}