import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateTokenCommandHandler } from "./commands/create.token.command";
import { PrismaModule } from "../prisma/prisma.module";

@Module( {
	imports: [ CqrsModule, PrismaModule ],
	providers: [ CreateTokenCommandHandler ]
} )
export class TokenModule {}