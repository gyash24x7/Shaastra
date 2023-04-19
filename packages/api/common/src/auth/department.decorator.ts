import { Department } from "@prisma/client";
import { SetMetadata } from "@nestjs/common";

export const DEPARTMENT_KEY = "AUTH_DEPARTMENTS";
export const RequiresDepartment = ( ...departments: Department[] ) => SetMetadata( DEPARTMENT_KEY, departments );