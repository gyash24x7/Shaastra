import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "../prisma/prisma.module";

@Module( {
	imports: [ CqrsModule, PrismaModule ]
} )
export class MessageModule {}