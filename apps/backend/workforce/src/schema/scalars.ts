import { DateResolver } from "graphql-scalars";
import { Department, MemberPosition } from "@prisma/client/workforce/index.js";
import { builder } from "./builder.js";

builder.addScalarType( "Date", DateResolver, {} );

builder.enumType( Department, { name: "Department" } );
builder.enumType( MemberPosition, { name: "MemberPosition" } );