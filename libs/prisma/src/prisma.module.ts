import { DynamicModule, Module } from "@nestjs/common";
import type { PrismaModuleAsyncOptions, PrismaModuleOptions, SERVICE_NAME } from "./prisma.options";
import { WorkforcePrismaService } from "./workforce.prisma.service";

export const PRISMA_OPTIONS = "PRISMA_OPTIONS";

@Module( {
	providers: [ WorkforcePrismaService ],
	exports: [ WorkforcePrismaService ],
} )
export class PrismaModule {

	static forService( service: SERVICE_NAME, { options, isGlobal }: PrismaModuleOptions = {} ): DynamicModule {
		return {
			global: isGlobal,
			module: PrismaModule,
			providers: [ { provide: PRISMA_OPTIONS, useValue: { [ service ]: options } } ]
		};
	}

	static forServiceAsync( service: SERVICE_NAME, options: PrismaModuleAsyncOptions ): DynamicModule {
		return {
			global: options.isGlobal,
			module: PrismaModule,
			imports: options.imports || [],
			providers: [
				{
					provide: PRISMA_OPTIONS,
					useFactory: ( ...args: any[] ) => ( {
						[ service ]: options.useFactory!( ...args )
					} ),
					inject: options.inject || []
				}
			]
		};
	}
}