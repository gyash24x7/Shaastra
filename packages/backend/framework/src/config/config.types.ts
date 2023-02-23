export type AppInfo = {
	id: string;
	name: string;
	url: string;
	pkg: string;
	port: number;
	address: string;
	isGateway: boolean;
}

export type AppConfig = {
	appInfo: AppInfo,
	db: {
		url: string;
	},
	auth: {
		audience: string;
		domain: string;
		privateKeyPath: string;
		publicKeyPath: string;
	},
	redis: {
		host: string;
		port: number;
	},
	graphql: {
		schemaPath?: string;
		graphRef: string;
	}
}