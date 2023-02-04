import { Module, DynamicModule } from "@nestjs/common";
import { CONFIG_DATA } from "./config.decorator.js";
import { generateConfig } from "./config.generate.js";

@Module( {} )
export class ConfigModule {
	static register( appId: string ): DynamicModule {
		const appConfig = generateConfig( appId );
		return {
			global: true,
			module: ConfigModule,
			providers: [ { provide: CONFIG_DATA, useValue: appConfig } ],
			exports: [ CONFIG_DATA ]
		};
	}
}