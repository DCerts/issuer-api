import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { Error } from './http';


/**
 * Handle errors for HTTP requests.
 */
const httpHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.beautify());
    return res.status(err.status).json(err);
};

export default httpHandler;