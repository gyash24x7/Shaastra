import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "@shaastra/prisma";
import { UserResolver } from "./user.resolver";
import { queryHandlers } from "./user.query.handlers";
import { commandHandlers } from "./user.command.handlers";

@Module( {
	imports: [ CqrsModule, PrismaModule ],
	providers: [ UserResolver, ...queryHandlers, ...commandHandlers ]
} )
export class UserModule {}