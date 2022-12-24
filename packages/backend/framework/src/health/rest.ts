import { RestApi } from "../rest/index.js";
import { hrtime, uptime } from "node:process";

export type HealthCheckResponse = {
	uptime: number;
	responseTime: [ number, number ];
	message?: string;
	timestamp: number;
}

export const healthRestApi = new RestApi( {
		method: "ALL",
		path: "/api/health",
		async handler( context ) {
			const healthCheck = await context.healthChecker.checkApiHealth( context );
			if ( !healthCheck ) {
				context.res.send( healthCheck );
			} else {
				context.res.status( 503 ).send();
			}
		}
	}
);

export const healthCheckRestApi = new RestApi( {
		method: "GET",
		path: "/api/health/check",
		handler( { res } ) {
			const healthCheck: HealthCheckResponse = {
				uptime: uptime(),
				responseTime: hrtime(),
				message: "OK",
				timestamp: Date.now()
			};

			try {
				res.send( healthCheck );
			} catch ( error: any ) {
				healthCheck.message = error.message;
				res.status( 503 ).send();
			}
		}
	}
);