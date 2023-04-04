import type { ModuleMetadata } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { ConfigModule, PrismaModule, PrismaService } from "../../src";

describe( "Prisma Module", () => {

	it( "should allow injection of prisma service", async () => {
		const testModuleMetadata: ModuleMetadata = {
			imports: [ ConfigModule.register(), PrismaModule ]
		};

		const testModule = await Test.createTestingModule( testModuleMetadata ).compile();
		await testModule.init();

		const prismaService = testModule.get( PrismaService );
		expect( prismaService ).toBeInstanceOf( PrismaClient );
	} );
} );