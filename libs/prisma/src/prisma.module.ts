import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WorkforcePrismaService } from "./workforce/prisma.service";

@Module( {
	imports: [ ConfigModule ],
	providers: [ WorkforcePrismaService ],
	exports: [ WorkforcePrismaService ]
} )
export class PrismaModule {}