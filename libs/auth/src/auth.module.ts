import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthStrategy } from "./auth.strategy";

@Module( {
	imports: [ PassportModule.register( { defaultStrategy: "jwt" } ) ],
	providers: [ AuthStrategy ],
	exports: [ PassportModule, AuthStrategy ]
} )
export class AuthModule {}

