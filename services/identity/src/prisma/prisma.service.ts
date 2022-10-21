import { INestApplicationContext, Injectable, OnModuleInit } from "@nestjs/common";
import type { PrismaShutdownHook } from "@shaastra/utils/prisma";
import { PrismaClient } from "@prisma/client/identity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient implements PrismaShutdownHook, OnModuleInit {
	constructor( configService: ConfigService ) {
		super( {
			datasources: {
				db: { url: configService.get<string>( "app.prisma.dbUrl" ) }
			}
		} );
	}

	async onModuleInit() {
		await this.$connect();
	}

	enableShutdownHooks( app: INestApplicationContext ) {
		this.$on( "beforeExit", async () => {
			await app.close();
		} );
	}
}