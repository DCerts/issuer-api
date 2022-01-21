import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ErrorCode } from './code';
import { BadRequestError, Error, NotFoundError } from './http';


/**
 * Handles errors for HTTP requests.
 */
const httpErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        err.path = req.originalUrl;
        logger.error(err.beautify());
    }
    else {
        logger.error(err.message);
        err = new BadRequestError(req.originalUrl, ErrorCode.INTERNAL_SERVER_ERROR);
    }
    return res.status(err.status).json(err);
};

/**
 * Handles errors for Page Not Found (404).
 */
const pathNotFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const err = new NotFoundError(req.originalUrl, ErrorCode.PATH_NOT_FOUND);
    return res.status(err.status).json(err);
};

export const ErrorHandlers = {
    httpErrorHandler,
    pathNotFoundHandler
};