import { DynamicModule, Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { HttpModule } from "@nestjs/axios";
import type { HealthModuleAsyncOptions, HealthModuleOptions } from "./health.options";

@Module( {
	imports: [ TerminusModule, HttpModule ],
	controllers: [ HealthController ],
	providers: [ HealthController ],
	exports: [ HealthController ]
} )
export class HealthModule {
	static forRoot( { options, isGlobal }: HealthModuleOptions ): DynamicModule {
		return {
			global: isGlobal,
			module: HealthModule,
			providers: [ { provide: "HEALTH_CONTROLLER_OPTIONS", useValue: options } ]
		};
	}

	static forRootAsync( options: HealthModuleAsyncOptions ): DynamicModule {
		return {
			global: options.isGlobal,
			module: HealthModule,
			imports: options.imports || [],
			providers: [
				{
					provide: "HEALTH_CONTROLLER_OPTIONS",
					useFactory: options.useFactory!,
					inject: options.inject || []
				}
			]
		};
	}
}
