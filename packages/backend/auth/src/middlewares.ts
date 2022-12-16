import type { NextFunction, Request, Response } from "express";

export type ExpressMiddleware = ( req: Request, res: Response, next: NextFunction ) => any | Promise<any>

export const requireUser: ExpressMiddleware = ( req, res, next ) => {
	if ( !req.user ) {
		res.status( 403 ).send();
	} else {
		return next();
	}
};
