import { Module } from "@nestjs/common";
import { WorkforcePrismaService } from "./workforce.prisma.service";
import { ConfigModule } from "@nestjs/config";
import { IdentityPrismaService } from "./identity.prisma.service";

@Module( {
	imports: [ ConfigModule ],
	providers: [ WorkforcePrismaService, IdentityPrismaService ],
	exports: [ WorkforcePrismaService, IdentityPrismaService ]
} )
export class PrismaModule {}