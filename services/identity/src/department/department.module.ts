import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CqrsModule } from "@nestjs/cqrs";
import { DepartmentQueryHandler } from "./queries/department.query";
import { DepartmentResolver } from "./department.resolver";

@Module( {
	imports: [ CqrsModule, PrismaModule ],
	providers: [ DepartmentQueryHandler, DepartmentResolver ]
} )
export class DepartmentModule {}