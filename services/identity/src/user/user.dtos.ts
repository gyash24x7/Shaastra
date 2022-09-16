import { UserModel } from "./user.model";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class LoginInput {
	@Field() username: string;
	@Field() password: string;
}

@ObjectType()
export class LoginResponsePayload {
	@Field() token: string;
	@Field( () => UserModel ) user: UserModel;
}