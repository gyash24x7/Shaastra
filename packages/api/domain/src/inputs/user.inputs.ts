import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginInput {
	@Field() username: string;
	@Field() password: string;
}

export class CreateUserInput {
	id: string;
	name: string;
	email: string;
	password: string;
	username: string;
	roles: string[];
}

@InputType()
export class VerifyUserInput {
	@Field() userId: string;
	@Field() hash: string;
}
