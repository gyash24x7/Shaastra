import { Module } from "@nestjs/common";
import { WorkforcePrismaService } from "./workforce.prisma.service";
import { ConfigModule } from "@nestjs/config";

@Module( {
	imports: [ ConfigModule ],
	providers: [ WorkforcePrismaService ],
	exports: [ WorkforcePrismaService ]
} )
export class PrismaModule {}