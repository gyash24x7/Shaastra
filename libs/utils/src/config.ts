export type AuthConfig = {
	domain: string;
	clientId: string;
	clientSecret: string;
	audience: string;
};

export type ConsulConfig = {
	host: string;
	port: string;
}

export type PrismaConfig = {
	dbUrl: string;
}

export type AppConfig = {
	id: string;
	name: string;
	pkg: string;
	port: number;
	address: string;
	prisma?: PrismaConfig;
	consul: ConsulConfig;
	auth?: AuthConfig;
}