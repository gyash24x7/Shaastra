import type { UserAuthInfo } from "@app/framework/auth";
import type { PrismaService } from "@app/framework/prisma";
import { HttpException, HttpStatus } from "@nestjs/common";
import type { EventBus } from "@nestjs/cqrs";
import { Channel, ChannelType, PrismaClient } from "@prisma/client/connect";
import { afterEach, describe, expect, it } from "vitest";
import { mockClear, mockDeep } from "vitest-mock-extended";
import { CreateChannelCommand, CreateChannelCommandHandler, type CreateChannelInput } from "../../src/commands";
import { ChannelMessages } from "../../src/constants";
import { ChannelCreatedEvent } from "../../src/events";

describe( "Create Channel Command Handler", () => {

	const mockPrismaService = mockDeep<PrismaService<PrismaClient>>();
	const mockEventBus = mockDeep<EventBus>();

	const mockAuthInfo: UserAuthInfo = {
		department: "WEBOPS",
		id: "mock-user-id",
		position: "COORD"
	};

	const mockCreateChannelInput: CreateChannelInput = {
		description: "Mock Channel Description",
		name: "Mock Channel",
		type: ChannelType.GROUP
	};

	const mockChannel: Channel = {
		archived: false,
		createdById: mockAuthInfo.id,
		createdOn: new Date(),
		id: "some-channel-id",
		...mockCreateChannelInput
	};

	it( "should create the channel and publish the channel created event", async () => {
		mockPrismaService.client.channel.findFirst.mockResolvedValue( null );
		mockPrismaService.client.channel.create.mockResolvedValue( mockChannel );

		const handler = new CreateChannelCommandHandler( mockPrismaService, mockEventBus );
		const channel = await handler.execute( new CreateChannelCommand( mockCreateChannelInput, mockAuthInfo ) );

		expect( mockPrismaService.client.channel.findFirst ).toHaveBeenCalledWith( {
			where: { name: mockCreateChannelInput.name }
		} );

		expect( mockPrismaService.client.channel.create ).toHaveBeenCalledWith( {
			data: { ...mockCreateChannelInput, createdById: mockAuthInfo.id }
		} );

		expect( mockEventBus.publish ).toHaveBeenCalledWith( new ChannelCreatedEvent( mockChannel ) );
		expect( channel ).toEqual( mockChannel );
	} );

	it( "should throw exception if user already exists with same email or roll number", async () => {
		mockPrismaService.client.channel.findFirst.mockResolvedValue( mockChannel );

		const handler = new CreateChannelCommandHandler( mockPrismaService, mockEventBus );

		expect.assertions( 5 );
		return handler.execute( new CreateChannelCommand( mockCreateChannelInput, mockAuthInfo ) )
			.catch( ( error: HttpException ) => {
				expect( mockPrismaService.client.channel.findFirst ).toHaveBeenCalledWith( {
					where: { name: mockCreateChannelInput.name }
				} );

				expect( mockPrismaService.client.channel.create ).toHaveBeenCalledTimes( 0 );
				expect( mockEventBus.publish ).toHaveBeenCalledTimes( 0 );
				expect( error.getStatus() ).toBe( HttpStatus.CONFLICT );
				expect( error.message ).toBe( ChannelMessages.ALREADY_EXISTS );
			} );
	} );

	afterEach( () => {
		mockClear( mockPrismaService );
		mockClear( mockEventBus );
	} );
} );