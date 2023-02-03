import { Inject } from "@nestjs/common";

export const PRISMA_CLIENT = "PRISMA_CLIENT";
export const PRISMA_SERVICE = "PRISMA_SERVICE";
export const Prisma = () => Inject( PRISMA_SERVICE );
