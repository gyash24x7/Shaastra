import { SetMetadata } from "@nestjs/common";

export type MemberPosition = "COORD" | "HEAD" | "CORE" | "COCAS";

export const Positions = ( ...positions: MemberPosition[] ) => SetMetadata( "positions", positions );