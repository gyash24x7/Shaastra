import { INestApplicationContext, Inject, Injectable } from "@nestjs/common";
import { LoggerFactory } from "../logger/index.js";
import { PRISMA_CLIENT } from "./prisma.decorator.js";
import { prismaLoggingMiddleware } from "./prisma.middleware.js";
import type { PrismaClientLike } from "./prisma.types.js";

@Injectable()
export class PrismaService<P extends PrismaClientLike = any> {
	private readonly logger = LoggerFactory.getLogger( PrismaService );

	constructor( @Inject( PRISMA_CLIENT ) public client: P ) {
		client.$use( prismaLoggingMiddleware( this.logger ) );
	}

	closeApp( app: INestApplicationContext ) {
		return async () => {
			await app.close();
		};
	}

	applyShutdownHooks( app: INestApplicationContext ) {
		this.client.$on( "beforeExit", this.closeApp( app ) );
	}
}