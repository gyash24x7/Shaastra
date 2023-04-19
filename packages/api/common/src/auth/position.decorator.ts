import { MemberPosition } from "@prisma/client";
import { SetMetadata } from "@nestjs/common";

export const POSITION_KEY = "AUTH_POSITIONS";
export const RequiresPosition = ( ...positions: MemberPosition[] ) => SetMetadata( POSITION_KEY, positions );