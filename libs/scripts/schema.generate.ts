import { NestFactory } from "@nestjs/core";
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from "@nestjs/graphql";
import { printSchema } from "graphql/utilities";
import { mergeSchemas } from "@graphql-tools/schema";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import type { GraphQLSchema } from "graphql/type";
import { writeFile } from "fs/promises";
import { join } from "path";
import identityResolvers from "../../services/identity/src/resolvers";
import connectResolvers from "../../services/workforce/src/resolvers";
import workforceResolvers from "../../services/connect/src/resolvers";

const serviceResolverMap: Record<string, Function[]> = {
	identity: identityResolvers,
	workforce: workforceResolvers,
	connect: connectResolvers
};

export async function generateServiceSchema( serviceName: string ) {
	const app = await NestFactory.create( GraphQLSchemaBuilderModule );
	await app.init();

	const gqlSchemaFactory = app.get( GraphQLSchemaFactory );

	const schema = await gqlSchemaFactory.create( serviceResolverMap[ serviceName ], { skipCheck: true } )
		.then( schema => {
			console.log( `GraphQL Schema generated for @shaastra/${ serviceName }!` );
			return schema;
		} )
		.finally( async () => await app.close() );
	await writeSchema( schema, `subgraphs/${ serviceName }.graphql` );
}

async function writeSchema( schema: GraphQLSchema, fileName: string ) {
	const filePath = join( __dirname, "../../schema", fileName );
	await writeFile( filePath, printSchema( schema ) );
	console.log( `Schema written to ${ filePath }` );
}

export async function loadServiceSchema( serviceName: string ) {
	return loadSchema(
		join( process.cwd(), "../../schema/subgraphs", `${ serviceName }.graphql` ),
		{ loaders: [ new GraphQLFileLoader() ] }
	);
}

export async function generateGatewaySchema() {
	const schemas = await Promise.all( Object.keys( serviceResolverMap ).map( loadServiceSchema ) );
	const schema = await mergeSchemas( { schemas, assumeValid: true, assumeValidSDL: true } );
	await writeSchema( schema, "supergraph.graphql" );
}

const serviceName = process.argv[ 2 ];
if ( serviceName !== "gateway" ) {
	generateServiceSchema( serviceName ).then().catch( err => {
		console.error( `Error generating schema for service @shaastra/${ serviceName }: ${ err }` );
		throw err;
	} );
} else {
	generateGatewaySchema().then().catch( err => {
		console.error( `Error generating schema for service @shaastra/${ serviceName }: ${ err }` );
		throw err;
	} );
}