import { INestApplication, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client/workforce"
import type { PrismaServiceOptions } from "./prisma.options";

@Injectable()
export class WorkforcePrismaService extends PrismaClient implements OnModuleInit {
	constructor( @Inject( "PRISMA_SERVICE_OPTIONS" ) prismaOptions: PrismaServiceOptions ) {
		super( { ...prismaOptions } );
	}

	async onModuleInit() {
		await this.$connect();
	}

	async enableShutdownHooks( app: INestApplication ) {
		this.$on( "beforeExit", async () => {
			await app.close();
		} );
	}
}