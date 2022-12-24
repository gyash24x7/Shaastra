import got from "got";
import type { HealthCheckResponse } from "./rest.js";
import type { ServiceBaseContext } from "../context/index.js";

export class HealthChecker<Ctx extends ServiceBaseContext> {
	async checkApiHealth( context: Ctx ) {
		const url = context.appInfo.url + "/api/health/check";
		const response = await got.get( url ).json<HealthCheckResponse>().catch( err => {
			context.logger.scope( "HealthChecker::checkApiHealth()" ).error( `Some Error: ${ err }` );
		} );

		context.logger.scope( "HealthChecker::checkApiHealth()" )
			.success( `HealthCheckResponse: ${ JSON.stringify( response ) }` );
		return response;
	}
}

export * from "./rest.js";