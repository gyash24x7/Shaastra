import { Module } from "@nestjs/common";
import { MemberResolver } from "./member.resolver";
import { GetMembersQueryHandler } from "./member.query.handlers";
import { CreateMemberCommandHandler, EnableMemberCommandHandler } from "./member.command.handlers";
import { PrismaModule } from "../prisma/prisma.module";
import { CqrsModule } from "@nestjs/cqrs";

@Module( {
	imports: [ PrismaModule, CqrsModule ],
	providers: [ MemberResolver, CreateMemberCommandHandler, GetMembersQueryHandler, EnableMemberCommandHandler ]
} )
export class MemberModule {}