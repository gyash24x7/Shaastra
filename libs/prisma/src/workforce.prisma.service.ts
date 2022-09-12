import { INestApplication, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client/workforce"
import type { PrismaOptions } from "./prisma.options";
import { PRISMA_OPTIONS } from "./prisma.module";

@Injectable()
export class WorkforcePrismaService extends PrismaClient implements OnModuleInit {
	constructor( @Inject( PRISMA_OPTIONS ) options: PrismaOptions ) {
		super( {
			datasources: {
				db: {
					url: options.workforce.url
				}
			}
		} );

		options.workforce.middlewares?.forEach( super.$use );
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