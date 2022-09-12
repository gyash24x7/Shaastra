import { Module } from "@nestjs/common";
import { MemberResolver } from "./member.resolver";
import { commandHandlers } from "./member.command.handlers";
import { CqrsModule } from "@nestjs/cqrs";
import { queryHandlers } from "./member.query.handlers";
import { PrismaModule } from "@shaastra/prisma";

@Module( {
	imports: [ CqrsModule, PrismaModule ],
	providers: [ MemberResolver, ...commandHandlers, ...queryHandlers ]
} )
export class MemberModule {}