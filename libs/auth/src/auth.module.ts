import { DynamicModule, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthStrategy } from "./auth.strategy";
import type { AuthModuleAsyncOptions, AuthModuleOptions } from "./auth.options";

@Module( {
	imports: [ PassportModule.register( { defaultStrategy: "jwt" } ) ],
	providers: [ AuthStrategy ],
	exports: [ PassportModule, AuthStrategy ]
} )
export class AuthModule {

	static forRoot( { options, isGlobal }: AuthModuleOptions ): DynamicModule {
		return {
			global: isGlobal,
			module: AuthModule,
			providers: [ { provide: "AUTH_STRATEGY_OPTIONS", useValue: options } ]
		};
	}

	static forRootAsync( options: AuthModuleAsyncOptions ): DynamicModule {
		return {
			global: options.isGlobal,
			module: AuthModule,
			imports: options.imports || [],
			providers: [
				{
					provide: "AUTH_STRATEGY_OPTIONS",
					useFactory: options.useFactory!,
					inject: options.inject || []
				}
			]
		};
	}
}

