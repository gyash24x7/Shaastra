import { Module } from "@nestjs/common";
import { MemberResolver } from "./member.resolver";
import { commandHandlers } from "./member.command.handlers";
import { CqrsModule } from "@nestjs/cqrs";
import { queryHandlers } from "./member.query.handlers";

@Module( {
	imports: [ CqrsModule ],
	providers: [ MemberResolver, ...commandHandlers, ...queryHandlers ]
} )
export class MemberModule {}