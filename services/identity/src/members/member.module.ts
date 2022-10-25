import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "../prisma/prisma.module";
import { MemberQueryHandler } from "./queries/member.query";
import { MemberResolver } from "./member.resolver";

@Module( {
	imports: [ CqrsModule, PrismaModule ],
	providers: [ MemberQueryHandler, MemberResolver ]
} )
export class MemberModule {}