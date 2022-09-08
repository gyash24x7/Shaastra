import { DynamicModule, Module, Provider } from "@nestjs/common";
import type { PrismaModuleAsyncOptions, PrismaModuleOptions } from "./prisma.options";
import { WorkforcePrismaService } from "./workforce.prisma.service";

@Module( {
	providers: [ WorkforcePrismaService ],
	exports: [ WorkforcePrismaService ],
} )
export class PrismaModule {
	static forRoot( { options, isGlobal }: PrismaModuleOptions = {} ): DynamicModule {
		return {
			global: isGlobal,
			module: PrismaModule,
			providers: [ { provide: "PRISMA_SERVICE_OPTIONS", useValue: options } ]
		};
	}

	static forRootAsync( options: PrismaModuleAsyncOptions ): DynamicModule {
		return {
			global: options.isGlobal,
			module: PrismaModule,
			imports: options.imports || [],
			providers: this.createAsyncProviders( options ),
		};
	}

	private static createAsyncProviders( options: PrismaModuleAsyncOptions, ): Provider[] {
		return [
			{
				provide: "PRISMA_SERVICE_OPTIONS",
				useFactory: options.useFactory!,
				inject: options.inject || []
			}
		];
	}
}