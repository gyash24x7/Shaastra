/* eslint-disable */
import type { Prisma, Member, Team } from "@prisma/client/workforce/index.js";

export default interface PrismaTypes {
	Member: {
		Name: "Member";
		Shape: Member;
		Include: Prisma.MemberInclude;
		Select: Prisma.MemberSelect;
		OrderBy: Prisma.MemberOrderByWithRelationInput;
		WhereUnique: Prisma.MemberWhereUniqueInput;
		Where: Prisma.MemberWhereInput;
		RelationName: "teams" | "teamsCreated";
		ListRelations: "teams" | "teamsCreated";
		Relations: {
			teams: {
				Shape: Team[];
				Types: PrismaTypes["Team"];
			};
			teamsCreated: {
				Shape: Team[];
				Types: PrismaTypes["Team"];
			};
		};
	};
	Team: {
		Name: "Team";
		Shape: Team;
		Include: Prisma.TeamInclude;
		Select: Prisma.TeamSelect;
		OrderBy: Prisma.TeamOrderByWithRelationInput;
		WhereUnique: Prisma.TeamWhereUniqueInput;
		Where: Prisma.TeamWhereInput;
		RelationName: "members" | "createdBy";
		ListRelations: "members";
		Relations: {
			members: {
				Shape: Member[];
				Types: PrismaTypes["Member"];
			};
			createdBy: {
				Shape: Member;
				Types: PrismaTypes["Member"];
			};
		};
	};
}