import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AuthStrategy } from "./auth.strategy";

@Module( {
	imports: [
		ConfigModule,
		PassportModule.register( { defaultStrategy: "jwt" } )
	],
	providers: [ AuthStrategy ],
	exports: [ PassportModule, AuthStrategy ]
} )
export class AuthModule {}

