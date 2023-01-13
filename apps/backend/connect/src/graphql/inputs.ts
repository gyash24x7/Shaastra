import type { ChannelType } from "@prisma/client/connect/index.js";
import type { OperationArgs } from "@shaastra/framework";

export type CreateChannelInput = {
	name: string;
	description: string;
	type: ChannelType;
}

export type CreateMessageInput = {
	content: string;
	channelId: string;
}

export type MutationCreateChannelArgs = OperationArgs<CreateChannelInput>
export type MutationCreateMessageArgs = OperationArgs<CreateMessageInput>

export type MessagesInput = {
	channelId: string;
}

export type QueryMessagesArgs = OperationArgs<MessagesInput>