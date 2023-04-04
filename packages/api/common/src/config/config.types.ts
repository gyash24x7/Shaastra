export type AppInfo = {
	id: string;
	name: string;
	url: string;
	port: number;
	address: string;
};

export type AppConfig = {
	appInfo: AppInfo;
	db: {
		url: string;
	};
	auth: {
		audience: string;
		domain: string;
		privateKeyPath: string;
		publicKeyPath: string;
	};
};
