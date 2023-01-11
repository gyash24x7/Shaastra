/* eslint-disable */
import type { Prisma, User, Token } from "@prisma/client/identity/index.js";

export default interface PrismaTypes {
	User: {
		Name: "User";
		Shape: User;
		Include: never;
		Select: Prisma.UserSelect;
		OrderBy: Prisma.UserOrderByWithRelationInput;
		WhereUnique: Prisma.UserWhereUniqueInput;
		Where: Prisma.UserWhereInput;
		RelationName: never;
		ListRelations: never;
		Relations: {};
	};
	Token: {
		Name: "Token";
		Shape: Token;
		Include: never;
		Select: Prisma.TokenSelect;
		OrderBy: Prisma.TokenOrderByWithRelationInput;
		WhereUnique: Prisma.TokenWhereUniqueInput;
		Where: Prisma.TokenWhereInput;
		RelationName: never;
		ListRelations: never;
		Relations: {};
	};
}