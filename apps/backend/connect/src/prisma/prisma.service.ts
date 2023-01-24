import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client/connect/index.js";
import type { WithShutdownHook } from "@shaastra/framework";
import { LoggerFactory } from "@shaastra/framework";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, WithShutdownHook {
	private readonly logger = LoggerFactory.getLogger( PrismaService );

	constructor() {
		super( {
			log: [ "query", "info", "warn", "error" ]
		} );

		this.$use( async ( params, next ) => {
			const before = Date.now();
			const result = await next( params );
			const after = Date.now();
			this.logger.debug( `Query ${ params.model }.${ params.action } took ${ after - before }ms` );
			return result;
		} );
	}

	async onModuleInit() {
		await this.$connect();
	}

	applyShutdownHooks( app: INestApplication ) {
		this.$on( "beforeExit", async () => {
			this.logger.debug( "Shutting down prisma client..." );
			await app.close();
		} );
	}
}