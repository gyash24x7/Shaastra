import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { LoginCommandHandler } from "./commands/login.command";
import { CreateUserCommandHandler } from "./commands/create.user.command";
import { VerifyUserCommandHandler } from "./commands/verify.user.command";
import { UserQueryHandler } from "./queries/user.query";
import { UserResolver } from "./user.resolver";
import { UserCreatedEventHandler } from "./events/user.created.event";
import { MailModule } from "@shaastra/mail";
import { JwtModule as NestJwtModule } from "@nestjs/jwt/dist/jwt.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtConfigFactory } from "@shaastra/utils/jwt";
import { PrismaModule } from "../prisma/prisma.module";

const JwtModule = NestJwtModule.registerAsync( {
	imports: [ ConfigModule ],
	inject: [ ConfigService ],
	useClass: JwtConfigFactory
} );

@Module( {
	imports: [ CqrsModule, MailModule, JwtModule, PrismaModule ],
	providers: [
		LoginCommandHandler,
		CreateUserCommandHandler,
		VerifyUserCommandHandler,
		UserQueryHandler,
		UserCreatedEventHandler,
		UserResolver
	]
} )
export class UserModule {}