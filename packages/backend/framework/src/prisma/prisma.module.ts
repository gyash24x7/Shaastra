import { DynamicModule, Module } from "@nestjs/common";
import { CONFIG_DATA } from "../config";
import { PRISMA_CLIENT, PRISMA_SERVICE } from "./prisma.decorator";
import { prismaClientFactory } from "./prisma.factory";
import { PrismaService } from "./prisma.service";
import type { ClientType, PrismaClientLike } from "./prisma.types";

@Module( {} )
export class PrismaModule {

	static register<P extends PrismaClientLike>( Client: ClientType<P> ): DynamicModule {
		return {
			module: PrismaModule,
			providers: [
				{ provide: PRISMA_CLIENT, useFactory: prismaClientFactory( Client ), inject: [ CONFIG_DATA ] },
				{ provide: PRISMA_SERVICE, useClass: PrismaService }
			],
			exports: [ PRISMA_SERVICE ]
		};
	}
}