/* eslint-disable */
import type { Prisma, Channel, Message } from "@prisma/client/connect/index.js";
export default interface PrismaTypes {
    Channel: {
        Name: "Channel";
        Shape: Channel;
        Include: Prisma.ChannelInclude;
        Select: Prisma.ChannelSelect;
        OrderBy: Prisma.ChannelOrderByWithRelationInput;
        WhereUnique: Prisma.ChannelWhereUniqueInput;
        Where: Prisma.ChannelWhereInput;
        RelationName: "messages";
        ListRelations: "messages";
        Relations: {
            messages: {
                Shape: Message[];
                Types: PrismaTypes["Message"];
            };
        };
    };
    Message: {
        Name: "Message";
        Shape: Message;
        Include: Prisma.MessageInclude;
        Select: Prisma.MessageSelect;
        OrderBy: Prisma.MessageOrderByWithRelationInput;
        WhereUnique: Prisma.MessageWhereUniqueInput;
        Where: Prisma.MessageWhereInput;
        RelationName: "channel";
        ListRelations: never;
        Relations: {
            channel: {
                Shape: Channel;
                Types: PrismaTypes["Channel"];
            };
        };
    };
}