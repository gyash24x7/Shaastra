import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "../prisma/prisma.module";
import { CreateMessageCommandHandler } from "./commands/create.message.command";
import { MessageCreatedEventHandler } from "./events/message.created.event";
import { MessageQueryHandler } from "./queries/message.query";
import { MessageResolver } from "./message.resolver";

@Module( {
	imports: [ CqrsModule, PrismaModule ],
	providers: [
		CreateMessageCommandHandler,
		MessageCreatedEventHandler,
		MessageQueryHandler,
		MessageResolver
	]
} )
export class MessageModule {}