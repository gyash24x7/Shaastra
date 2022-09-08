import { DynamicModule, Module } from "@nestjs/common";
import { ConsulService } from "./consul.service";
import type { ConsulModuleAsyncOptions, ConsulModuleOptions } from "./consul.options";

@Module( {
	providers: [ ConsulService ],
	exports: [ ConsulService ]
} )
export class ConsulModule {
	static forRoot( { options, isGlobal }: ConsulModuleOptions ): DynamicModule {
		return {
			global: isGlobal,
			module: ConsulModule,
			providers: [ { provide: "CONSUL_SERVICE_OPTIONS", useValue: options } ]
		};
	}

	static forRootAsync( options: ConsulModuleAsyncOptions ): DynamicModule {
		return {
			global: options.isGlobal,
			module: ConsulModule,
			imports: options.imports || [],
			providers: [
				{
					provide: "CONSUL_SERVICE_OPTIONS",
					useFactory: options.useFactory!,
					inject: options.inject || []
				}
			]
		};
	}
}
