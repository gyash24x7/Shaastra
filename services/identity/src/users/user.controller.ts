import { CreateUserCommand, CreateUserInput } from "./commands/create.user.command";
import { CommandBus } from "@nestjs/cqrs";
import { Body, Controller, Post } from "@nestjs/common";

@Controller( "/api/users" )
export class UserController {
	constructor( private readonly commandBus: CommandBus ) {}

	@Post()
	createUser( @Body() data: CreateUserInput ): Promise<string> {
		console.log();
		return this.commandBus.execute( new CreateUserCommand( data ) );
	}
}