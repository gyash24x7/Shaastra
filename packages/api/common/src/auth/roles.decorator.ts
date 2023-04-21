import { SetMetadata } from "@nestjs/common";
import { Department, Position } from "@prisma/client";

export const ROLES_KEY = "AUTH_ROLES";
export const RequiresRole = ( ...roles: string[] ) => SetMetadata( ROLES_KEY, roles );

export const RequiresDepartment = ( ...departments: Department[] ) => {
	return RequiresRole( ...departments.map( department => "MEMBER_".concat( department ) ) );
};

export const RequiresPosition = ( ...departments: Position[] ) => {
	return RequiresRole( ...departments.map( department => "POSITION_".concat( department ) ) );
};
