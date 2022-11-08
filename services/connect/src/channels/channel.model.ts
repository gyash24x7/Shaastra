import type { Channel, Message } from "@prisma/client/connect";
import { ChannelType } from "@prisma/client/connect";
import { Directive, Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { MessageModel } from "../messages/message.model";

registerEnumType( ChannelType, { name: "ChannelType" } );

@ObjectType( ChannelModel.TYPENAME )
@Directive( `@key(fields: "id")` )
export class ChannelModel implements Channel {
	public static readonly TYPENAME = "Channel";
	@Field( () => ID ) id: string;
	@Field() archived: boolean;
	@Field() createdById: string;
	@Field() createdOn: Date;
	@Field() description: string;
	@Field() name: string;
	@Field( () => ChannelType ) type: ChannelType;

	@Field( () => [ MessageModel ] ) messages: Message[];
}