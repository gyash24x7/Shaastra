import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client/workforce"
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WorkforcePrismaService extends PrismaClient implements OnModuleInit {
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

	async enableShutdownHooks( app: INestApplication ) {
		this.$on( "beforeExit", async () => {
			await app.close();
		} );
	}
}