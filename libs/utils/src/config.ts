export type AuthConfig = {
	domain: string;
	audience: string;
	keyId?: string;
};

export type MailConfig = {
	apiKey: string;
	apiSecret: string;
	sender: { email: string, name: string };
}

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
	url: string;
	pkg: string;
	port: number;
	address: string;
	prisma?: PrismaConfig;
	consul: ConsulConfig;
	auth?: AuthConfig;
	mail?: MailConfig;
}