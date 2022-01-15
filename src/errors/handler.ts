import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ErrorCode } from './code';
import { Error, NotFoundError } from './http';


/**
 * Handles errors for HTTP requests.
 */
const httpErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    err.path = req.originalUrl;
    logger.error(err.beautify());
    return res.status(err.status).json(err);
};

/**
 * Handles errors for Page Not Found (404).
 */
const pathNotFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const err = new NotFoundError(req.originalUrl, ErrorCode.PATH_NOT_FOUND);
    return res.status(err.status).json(err);
};

export {
    httpErrorHandler,
    pathNotFoundHandler
};