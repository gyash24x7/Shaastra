import type { LoggerService } from "../logger/logger.service.js";
import type { PrismaMiddleware } from "./prisma.types.js";

export function prismaLoggingMiddleware( logger: LoggerService ): PrismaMiddleware {
	return async ( params, next ) => {
		const before = Date.now();
		const result = await next( params );
		const after = Date.now();
		logger.debug( `Query ${ params.model }.${ params.action } took ${ after - before }ms` );
		return result;
	};
}