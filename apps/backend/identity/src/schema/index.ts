import { builder } from "./builder.js";
import "../entities/index.js";
import "../mutations/index.js";

export const schema = builder.toSubGraphSchema( { sortSchema: true } );