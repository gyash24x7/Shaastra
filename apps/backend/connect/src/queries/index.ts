import { QueryBus } from "@shaastra/cqrs";
import { ChannelQuery } from "./channel.query.js";
import { MessageQuery } from "./message.query.js";
import { MessagesQuery } from "./messages.query.js";

const queryBus = new QueryBus();
queryBus.registerQuery( ChannelQuery );
queryBus.registerQuery( MessagesQuery );
queryBus.registerQuery( MessageQuery );

export { queryBus };

export * from "./channel.query.js";
export * from "./message.query.js";
export * from "./messages.query.js";