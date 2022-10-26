import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "../prisma/prisma.module";
import { MemberQueryHandler } from "./queries/member.query";
import { MemberResolver } from "./member.resolver";
import { CreateMemberCommandHandler } from "./commands/create.member.command";
import { EnableMemberCommandHandler } from "./commands/enable.member.command";
import { MemberCreatedEventHandler } from "./events/member.created.event";
import { MemberEnabledEventHandler } from "./events/member.enabled.event";
import { DeptCoreQueryHandler } from "./queries/dept-core.query";

@Module( {
	imports: [ CqrsModule, PrismaModule ],
	providers: [
		MemberQueryHandler,
		CreateMemberCommandHandler,
		EnableMemberCommandHandler,
		MemberCreatedEventHandler,
		MemberEnabledEventHandler,
		DeptCoreQueryHandler,
		MemberResolver
	]
} )
export class MemberModule {}