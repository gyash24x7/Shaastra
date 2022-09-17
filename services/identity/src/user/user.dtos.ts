import { UserModel } from "./user.model";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class LoginInput {
	@Field() username: string;
	@Field() password: string;
}

@ObjectType()
export class AuthResponsePayload {
	@Field() token: string;
	@Field( () => UserModel ) user: UserModel;
}

@InputType()
export class CreateUserInput {
	@Field() name: string;
	@Field() email: string;
	@Field() username: string;
	@Field() password: string;
}