import "../entities/index.js";
import "../mutations/index.js";
import "../queries/index.js";
import { builder } from "./builder";
import "./scalars.js";

export const schema = builder.toSubGraphSchema( { sortSchema: true } );