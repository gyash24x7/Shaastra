import { printSchema } from "graphql/utilities";
import { mergeSchemas } from "@graphql-tools/schema";
import type { GraphQLSchema } from "graphql/type";
import { writeFile } from "fs/promises";
import { join } from "path";
import identityResolvers from "../../services/identity/src/resolvers";
import connectResolvers from "../../services/workforce/src/resolvers";
import workforceResolvers from "../../services/connect/src/resolvers";
import { loadServiceSchema } from "@shaastra/utils";

const serviceResolverMap: Record<string, Function[]> = {
	identity: identityResolvers,
	workforce: workforceResolvers,
	connect: connectResolvers
};

async function writeSchema( schema: GraphQLSchema, fileName: string ) {
	const filePath = join( __dirname, "../../schema", fileName );
	await writeFile( filePath, printSchema( schema ) );
	console.log( `Schema written to ${ filePath }` );
}

export async function generateGatewaySchema() {
	const schemas = await Promise.all( Object.keys( serviceResolverMap ).map( loadServiceSchema ) );
	const schema = await mergeSchemas( { schemas, assumeValid: true, assumeValidSDL: true } );
	await writeSchema( schema, "supergraph.graphql" );
}

generateGatewaySchema().then().catch( err => {
	console.error( `Error generating schema for service @shaastra/gateway: ${ err }` );
	throw err;
} );