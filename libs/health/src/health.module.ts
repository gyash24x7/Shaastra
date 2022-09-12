import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module( {
	imports: [ ConfigModule, TerminusModule, HttpModule ],
	controllers: [ HealthController ],
	providers: [ HealthController ],
	exports: [ HealthController ]
} )
export class HealthModule {}
