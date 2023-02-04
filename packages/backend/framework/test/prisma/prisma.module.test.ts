import { Injectable, ModuleMetadata } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Prisma, PrismaService, PrismaModule } from "../../src/index.js";

class MockPrismaClientType {
	$connect = vi.fn().mockImplementation( () => "$connect" );
	$disconnect = vi.fn().mockImplementation( () => "$disconnect" );
	$on = vi.fn().mockImplementation( () => "$on" );
	$use = vi.fn().mockImplementation( () => "$use" );
}

@Injectable()
class ExampleService {

	constructor( @Prisma() private readonly prismaService: PrismaService<MockPrismaClientType> ) {}

	get prismaClient() {
		return this.prismaService.client;
	}
}

describe( "Prisma Module", () => {

	it( "should allow injection of prisma service", async () => {
		const testModuleMetadata: ModuleMetadata = {
			imports: [ PrismaModule.register( { client: MockPrismaClientType } ) ],
			providers: [ ExampleService ]
		};

		const testModule = await Test.createTestingModule( testModuleMetadata ).compile();
		await testModule.init();

		const exampleService = testModule.get( ExampleService );
		const client = exampleService.prismaClient;

		expect( client ).toBeInstanceOf( MockPrismaClientType );
		expect( client.$disconnect() ).toBe( "$disconnect" );
	} );
} );