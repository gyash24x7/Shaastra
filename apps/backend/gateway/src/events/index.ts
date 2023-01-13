import type { PrismaClient } from "@prisma/client/identity/index.js";
import type { IEvents } from "@shaastra/framework";
import userCreatedEventHandler from "./user.created.event.js";

export * from "./user.created.event.js";

export enum AppEvents {
	USER_CREATED_EVENT = "USER_CREATED_EVENT"
}

const events: IEvents<PrismaClient> = {
	USER_CREATED_EVENT: userCreatedEventHandler
};

export default events;