import { DynamicModule, Module } from "@nestjs/common";
import { CONFIG_DATA } from "./config.decorator";
import { generateConfig } from "./config.generate";

@Module( {} )
export class BaseConfigModule {
	static register(): DynamicModule {
		return {
			module: BaseConfigModule,
			providers: [ { provide: CONFIG_DATA, useValue: generateConfig() } ],
			exports: [ CONFIG_DATA ]
		};
	}
}

export const ConfigModule = BaseConfigModule.register();