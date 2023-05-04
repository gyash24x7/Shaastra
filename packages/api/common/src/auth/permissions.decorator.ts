import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = "AUTH_PERMISSIONS";
export const RequiresPermission = ( ...permissions: string[] ) => SetMetadata( PERMISSIONS_KEY, permissions );
