import { EventBus } from "@shaastra/cqrs";
import { UserCreatedEvent } from "./user.created.event.js";

const eventBus = new EventBus();
eventBus.registerEvent( UserCreatedEvent );

export { eventBus };

export * from "./user.created.event.js";