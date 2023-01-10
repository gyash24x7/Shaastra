import { ChannelType } from "@prisma/client/connect";
import { DateResolver } from "graphql-scalars";
import { builder } from "./builder";

export const dateRef = builder.addScalarType( "Date", DateResolver, {} );

export const channelTypeRef = builder.enumType( ChannelType, { name: "ChannelType" } );