import type { PrismaClient } from "@prisma/client/connect/index.js";
import type { IEvents } from "@shaastra/framework";

export enum AppEvents {}

const events: IEvents<PrismaClient, AppEvents> = {};

export default events;