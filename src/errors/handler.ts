import { Request, Response, NextFunction } from 'express';
import { Error } from './http';


/**
 * Handle errors for HTTP requests.
 */
const httpHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    return res.status(err.status).json(err);
};

export default httpHandler;