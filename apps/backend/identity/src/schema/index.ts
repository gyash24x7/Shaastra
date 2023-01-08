import "../entities/index.js";
import "../mutations/index.js";
import { builder } from "./builder.js";

export const schema = builder.toSubGraphSchema( { sortSchema: true } );