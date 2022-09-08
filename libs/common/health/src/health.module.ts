import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

@Module( {
	imports: [ ConfigModule, TerminusModule, HttpModule ],
	controllers: [ HealthController ],
	providers: [ HealthController ],
	exports: [ HealthController ]
} )
export class HealthModule {}
