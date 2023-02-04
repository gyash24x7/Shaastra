import { DynamicModule, Module } from "@nestjs/common";
import { PRISMA_CLIENT, PRISMA_SERVICE } from "./prisma.decorator.js";
import type { PrismaClientLike, PrismaModuleOptions } from "./prisma.interfaces.js";
import { PrismaService } from "./prisma.service.js";

@Module( {} )
export class PrismaModule {

	static register<P extends PrismaClientLike>( { client: Client }: PrismaModuleOptions<P> ): DynamicModule {
		const client = new Client( {
			log: [ "query", "info", "warn", "error" ]
		} );

		return {
			module: PrismaModule,
			providers: [
				{ provide: PRISMA_CLIENT, useValue: client },
				{ provide: PRISMA_SERVICE, useClass: PrismaService }
			],
			exports: [ PRISMA_SERVICE ]
		};
	}
}