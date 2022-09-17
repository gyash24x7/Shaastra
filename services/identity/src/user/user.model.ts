import type { User } from "@prisma/client/identity";
import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType( UserModel.TYPENAME )
@Directive( `@key(fields:"id")` )
export class UserModel implements User {
	static readonly TYPENAME = "User";

	@Field( () => ID ) id: string;
	@Field() name: string;
	@Field() email: string;
	@Field() username: string;
	@Field() verified: boolean;
	@Field( () => [ String ] ) roles: string[];
	@Field( () => [ String ] ) permissions: string[];

	password: string;
}