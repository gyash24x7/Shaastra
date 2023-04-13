import { INestApplicationContext, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { type AppConfig, Config } from "../config";
import { LoggerFactory } from "../logger";
import { prismaLoggingMiddleware } from "./prisma.middleware";

@Injectable()
export class PrismaService extends PrismaClient {
	private readonly logger = LoggerFactory.getLogger( PrismaService );

	constructor( @Config() readonly config: AppConfig ) {
		super( {
			datasources: { db: config.db },
			log: [ "query", "info", "warn", "error" ]
		} );

		this.$use( prismaLoggingMiddleware( this.logger ) );
	}

	closeApp( app: INestApplicationContext ) {
		return async () => {
			await app.close();
		};
	}

	applyShutdownHooks( app: INestApplicationContext ) {
		this.$on( "beforeExit", this.closeApp( app ) );
	}
}
