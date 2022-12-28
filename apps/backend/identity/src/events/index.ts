import type { IEvents } from "@shaastra/framework";
import userCreatedEventHandler from "./user.created.event.js";

export * from "./user.created.event.js";

export enum AppEvents {
	USER_CREATED_EVENT = "USER_CREATED_EVENT"
}

const events: IEvents<AppEvents> = {
	USER_CREATED_EVENT: userCreatedEventHandler
};

export default events;