import { Global, Module } from "@nestjs/common";
import { CONFIG_DATA } from "./config.decorator";
import { generateConfig } from "./config.generate";

@Global()
@Module( {
	providers: [ { provide: CONFIG_DATA, useValue: generateConfig() } ],
	exports: [ CONFIG_DATA ]
} )
export class ConfigModule {}
