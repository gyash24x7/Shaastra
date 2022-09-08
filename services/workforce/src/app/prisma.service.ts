import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@workforce/prisma"

export * from "@workforce/prisma";

@Injectable()
export class WorkforcePrismaService extends PrismaClient implements OnModuleInit {
	constructor( configService: ConfigService ) {
		super( {
			log: [ "query" ],
			datasources: {
				db: { url: configService.get<string>( "app.prisma.dbUrl" )! }
			}
		} );
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