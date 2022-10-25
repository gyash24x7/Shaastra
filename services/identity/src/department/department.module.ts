import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CqrsModule } from "@nestjs/cqrs";

@Module( {
	imports: [ CqrsModule, PrismaModule ]
} )
export class DepartmentModule {}