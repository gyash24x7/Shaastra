import type { Request, Response } from "express";

export * from "./bootstrap";

export type ServiceContext = {
	req: Request;
	res: Response;
};
