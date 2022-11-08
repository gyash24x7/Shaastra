import { SetMetadata } from "@nestjs/common";
import type { MemberPosition } from "@prisma/client/workforce";

export const Positions = ( ...positions: MemberPosition[] ) => SetMetadata( "positions", positions );