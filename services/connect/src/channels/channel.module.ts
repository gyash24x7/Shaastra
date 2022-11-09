import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "../prisma/prisma.module";
import { CreateChannelCommandHandler } from "./commands/create.channel.command";
import { ChannelQueryHandler } from "./queries/channel.query";
import { ChannelResolver } from "./channel.resolver";

@Module( {
	imports: [ CqrsModule, PrismaModule ],
	providers: [
		CreateChannelCommandHandler,
		ChannelQueryHandler,
		ChannelResolver
	]
} )
export class ChannelModule {}