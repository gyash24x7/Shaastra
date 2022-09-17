import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "@shaastra/prisma";
import { UserResolver } from "./user.resolver";
import { queryHandlers } from "./user.query.handlers";
import { commandHandlers } from "./user.command.handlers";
import { JwtModule } from "@nestjs/jwt";

@Module( {
	imports: [ CqrsModule, PrismaModule, JwtModule.register( {} ) ],
	providers: [ UserResolver, ...queryHandlers, ...commandHandlers ]
} )
export class UserModule {}