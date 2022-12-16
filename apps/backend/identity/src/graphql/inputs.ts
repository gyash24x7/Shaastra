import type { OperationArgs } from "@shaastra/utils";

export type LoginInput = {
	username: string;
	password: string;
};

export type VerifyUserInput = {
	userId: string;
	tokenId: string;
};

export type MutationLoginArgs = OperationArgs<LoginInput>;
export type MutationVerifyUserArgs = OperationArgs<VerifyUserInput>;
