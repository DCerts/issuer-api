import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from './code';
import { Error } from './http';


/**
 * Handle errors for HTTP requests.
 */
const httpHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err.status) {
        return res.status(err.status).json({
            path: err?.path,
            code: err?.code,
            message: err?.message
        });
    }
    return res.status(500).json({
        path: err?.path,
        code: ErrorCode.WHOOPS,
        message: 'Whoops!'
    });
};

export default httpHandler;