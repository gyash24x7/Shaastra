import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler } from "@nestjs/cqrs";
import dayjs from "dayjs";
import { PrismaService } from "../../prisma/prisma.service";
import { Field, InputType } from "@nestjs/graphql";

@InputType( VerifyUserInput.TYPENAME )
export class VerifyUserInput {
	public static readonly TYPENAME = "VerifyUserInput";
	@Field() userId: string;
	@Field() tokenId: string;
}

export class VerifyUserCommand implements ICommand {
	constructor( public readonly data: VerifyUserInput ) {}
}

@CommandHandler( VerifyUserCommand )
export class VerifyUserCommandHandler implements ICommandHandler<VerifyUserCommand, string> {
	constructor( private readonly prismaService: PrismaService ) {}

	async execute( { data }: VerifyUserCommand ) {
		const user = await this.prismaService.user.findUnique( { where: { id: data.userId } } );
		if ( !user ) {
			return "";
		}

		const token = await this.prismaService.token.findUnique( { where: { id: data.tokenId } } );
		if ( !token || dayjs().isAfter( token.expiry ) ) {
			return "";
		}

		await this.prismaService.user.update( {
			where: { id: data.userId },
			data: { verified: true }
		} );

		await this.prismaService.token.delete( { where: { id: data.tokenId } } );

		return user.id;
	}

}