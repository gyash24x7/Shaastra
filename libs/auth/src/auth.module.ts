import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthStrategy } from "./auth.strategy";
import { ConfigModule } from "@nestjs/config";

@Module( {
	imports: [ ConfigModule, PassportModule.register( { defaultStrategy: "jwt" } ) ],
	providers: [ AuthStrategy ],
	exports: [ PassportModule, AuthStrategy ]
} )
export class AuthModule {}

