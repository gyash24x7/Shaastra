import { DynamicModule, Module } from "@nestjs/common";
import { PRISMA_CLIENT, PRISMA_SERVICE } from "./prisma.decorator.js";
import type { PrismaClientLike, PrismaModuleOptions } from "./prisma.interfaces.js";
import { PrismaService } from "./prisma.service.js";

@Module( {} )
export class PrismaModule {

	static registerAsync<P extends PrismaClientLike>( options: PrismaModuleOptions<P> ): DynamicModule {
		return {
			module: PrismaModule,
			imports: options.imports,
			providers: [
				{ provide: PRISMA_CLIENT, useFactory: options.useFactory, inject: options.inject },
				{ provide: PRISMA_SERVICE, useClass: PrismaService }
			],
			exports: [ PRISMA_SERVICE ]
		};
	}
}