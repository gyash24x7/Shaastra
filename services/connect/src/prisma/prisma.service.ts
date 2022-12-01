import { BeforeApplicationShutdown, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "./generated/index.js";

@Injectable()
export class PrismaService extends PrismaClient implements BeforeApplicationShutdown, OnModuleInit {

	async onModuleInit() {
		await this.$connect();
	}

	async beforeApplicationShutdown() {
		await this.$disconnect();
	}
}