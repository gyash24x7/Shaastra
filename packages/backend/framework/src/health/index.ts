import got from "got";
import type { HealthCheckResponse } from "./rest.js";
import type { ServiceBaseContext } from "../context/index.js";
import { logger } from "../logger/index.js";

export class HealthChecker<Ctx extends ServiceBaseContext> {
	async checkApiHealth( context: Ctx ) {
		logger.trace( ">> HealthChecker::checkApiHealth()" );
		const url = context.appInfo.url + "/api/health/check";
		const response = await got.get( url ).json<HealthCheckResponse>().catch( err => {
			logger.error( `Some Error: ${ err }` );
		} );

		logger.debug( `HealthCheckResponse: ${ JSON.stringify( response ) }` );
		logger.trace( "<< HealthChecker::checkApiHealth()" );
		return response;
	}
}

export * from "./rest.js";