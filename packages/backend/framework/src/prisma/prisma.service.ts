import { INestApplicationContext, Inject, Injectable } from "@nestjs/common";
import { LoggerFactory } from "../logger";
import { PRISMA_CLIENT } from "./prisma.decorator";
import { prismaLoggingMiddleware } from "./prisma.middleware";
import type { PrismaClientLike } from "./prisma.types";

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