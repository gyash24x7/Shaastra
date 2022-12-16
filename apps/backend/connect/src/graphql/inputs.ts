import type { ChannelType } from "@prisma/client/connect/index.js";
import type { OperationArgs } from "@shaastra/utils";

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

export type GetMessagesInput = {
	channelId: string;
}

export type QueryGetMessagesArgs = OperationArgs<GetMessagesInput>