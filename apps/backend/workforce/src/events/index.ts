import { EventBus } from "@shaastra/cqrs";
import { MemberCreatedEvent } from "./member.created.event.js";
import { MemberEnabledEvent } from "./member.enabled.event.js";
import { TeamCreatedEvent } from "./team.created.event.js";

const eventBus = new EventBus();
eventBus.registerEvent( MemberCreatedEvent );
eventBus.registerEvent( MemberEnabledEvent );
eventBus.registerEvent( TeamCreatedEvent );

export { eventBus };

export * from "./member.created.event.js";
export * from "./member.enabled.event.js";
export * from "./team.created.event.js";