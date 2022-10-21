import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { RoleQueryHandler } from "./queries/role.query";
import { RoleResolver } from "./role.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module( {
	imports: [ CqrsModule, PrismaModule ],
	providers: [ RoleQueryHandler, RoleResolver ]
} )
export class RoleModule {}