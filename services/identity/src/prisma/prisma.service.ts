import { BeforeApplicationShutdown, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client/identity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient implements BeforeApplicationShutdown, OnModuleInit {
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

	async beforeApplicationShutdown() {
		await this.$disconnect();
	}
}