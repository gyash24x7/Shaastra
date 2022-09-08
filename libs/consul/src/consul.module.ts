import { Module } from "@nestjs/common";
import { ConsulService } from "./consul.service";
import { ConfigModule } from "@nestjs/config";

@Module( {
	imports: [ ConfigModule ],
	providers: [ ConsulService ],
	exports: [ ConsulService ]
} )
export class ConsulModule {}
