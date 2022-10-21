import { AppModule } from "./app/app.module";
import { bootstrap } from "@shaastra/utils/nest";
import { PrismaService } from "./prisma/prisma.service";

bootstrap( AppModule, PrismaService ).then();