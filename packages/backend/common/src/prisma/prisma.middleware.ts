import type { Prisma } from "@prisma/client";
import type { LoggerService } from "../logger/logger.service";

export function prismaLoggingMiddleware( logger: LoggerService ): Prisma.Middleware {
	return async ( params, next ) => {
		const before = Date.now();
		const result = await next( params );
		const after = Date.now();
		logger.debug( `Query ${ params.model }.${ params.action } took ${ after - before }ms` );
		return result;
	};
}
