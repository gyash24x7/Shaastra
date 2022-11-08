import type { User } from "@prisma/client/identity";
import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType( UserModel.TYPENAME )
@Directive( `@key(fields: "id")` )
export class UserModel implements User {
	public static readonly TYPENAME = "User";
	@Field() email: string;
	@Field( () => ID ) id: string;
	@Field() name: string;
	password: string;
	@Field( () => [ String ] ) roles: string[];
	@Field() username: string;
	@Field() verified: boolean;
}