import { PrismaClient } from "@prisma/client/connect/index.js";
import { logger } from "../index.js";

export const prisma = new PrismaClient( {
	log: [ "query" ]
} );

prisma.$use( async ( params, next ) => {
	const before = Date.now();
	const result = await next( params );
	const after = Date.now();
	logger.debug( `Query ${ params.model }.${ params.action } took ${ after - before }ms` );
	return result;
} );