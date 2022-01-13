import 'express-async-errors';
import { ErrorCode } from './code';


class Error {
    timestamp: number;
    status: number;
    path: string;
    code: ErrorCode | string | undefined;
    message: string | undefined;
    props: Array<any> | undefined;

    constructor(
        status: number,
        path: string,
        code?: ErrorCode | string,
        message?: string,
        props?: Array<any>
    ) {
        this.timestamp = +new Date();
        this.status = status;
        this.path = path;
        this.code = code;
        this.message = message;
        this.props = props;
    }
}

class BadRequestError extends Error {
    constructor(path: string, code?: ErrorCode | string, message?: string) {
        super(400, path, code, message);
    }
}

class UnauthorizedError extends Error {
    constructor(path: string, code?: ErrorCode | string, message?: string) {
        super(401, path, code, message);
    }
}

class NotFoundError extends Error {
    constructor(path: string, code?: ErrorCode | string, message?: string) {
        super(404, path, code, message);
    }
}

export {
    Error,
    UnauthorizedError,
    BadRequestError,
    NotFoundError
};