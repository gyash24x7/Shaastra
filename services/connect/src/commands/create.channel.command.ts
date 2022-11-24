import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler } from "@nestjs/cqrs";
import type { UserAuthInfo } from "@shaastra/auth";
import { Field, InputType } from "@nestjs/graphql";
import { ChannelType, PrismaService } from "../prisma";

@InputType( CreateChannelInput.TYPENAME )
export class CreateChannelInput {
	public static readonly TYPENAME = CreateChannelInput.name;
	@Field() name: string;
	@Field() description: string;
	@Field( () => ChannelType ) type: ChannelType;
}

export class CreateChannelCommand implements ICommand {
	constructor( public readonly data: CreateChannelInput, public readonly authInfo: UserAuthInfo ) {}
}

@CommandHandler( CreateChannelCommand )
export class CreateChannelCommandHandler implements ICommandHandler<CreateChannelCommand, string> {
	constructor( private readonly prismaService: PrismaService ) {}

	async execute( { data, authInfo }: CreateChannelCommand ): Promise<string> {
		const channel = await this.prismaService.channel.create( {
			data: { ...data, createdById: authInfo.id }
		} );

		return channel.id;
	}
}