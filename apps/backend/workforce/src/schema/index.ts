import { builder } from "./builder.js";
import "./scalars.js";
import "../entities/index.js";
import "../mutations/index.js";
import "../queries/index.js";

export const schema = builder.toSubGraphSchema( { sortSchema: true } );