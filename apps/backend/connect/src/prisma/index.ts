import { PrismaClient } from "@prisma/client/connect";
import { logger } from "..";

export const prisma = new PrismaClient( {
	log: [ "query", "info", "warn", "error" ]
} );

prisma.$use( async ( params, next ) => {
	const before = Date.now();
	const result = await next( params );
	const after = Date.now();
	logger.debug( `Query ${ params.model }.${ params.action } took ${ after - before }ms` );
	return result;
} );