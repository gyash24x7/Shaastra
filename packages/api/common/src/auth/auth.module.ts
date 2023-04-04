import { Module } from "@nestjs/common";
import { ConfigModule } from "../config";
import { JwtService } from "./jwt.service";

@Module( {
	imports: [ ConfigModule ],
	providers: [ JwtService ],
	exports: [ JwtService ]
} )
export class AuthModule {}
