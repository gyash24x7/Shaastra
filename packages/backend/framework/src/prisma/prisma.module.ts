import { DynamicModule, Module } from "@nestjs/common";
import { PRISMA_CLIENT, PRISMA_SERVICE } from "./prisma.decorator.js";
import type { PrismaClientLike, PrismaModuleOptions } from "./prisma.interfaces.js";
import { PrismaService } from "./prisma.service.js";

@Module( {} )
export class PrismaModule {

	static register<P extends PrismaClientLike>( options: PrismaModuleOptions<P> ): DynamicModule {
		return {
			module: PrismaModule,
			providers: [
				{ provide: PRISMA_CLIENT, useValue: options.client },
				{ provide: PRISMA_SERVICE, useClass: PrismaService }
			],
			exports: [ PRISMA_SERVICE ]
		};
	}
}