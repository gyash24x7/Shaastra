import { DateResolver } from "graphql-scalars";
import { ChannelType } from "@prisma/client/connect/index.js";
import { builder } from "./builder.js";

export const dateRef = builder.addScalarType( "Date", DateResolver, {} );

export const channelTypeRef = builder.enumType( ChannelType, { name: "ChannelType" } );