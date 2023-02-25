import { bootstrap } from "@app/framework/utils";
import { AppModule } from "./app.module";

bootstrap( AppModule, "gateway" ).then();
