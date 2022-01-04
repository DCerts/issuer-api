import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Account } from '../models/account';
import AccountRepository from '../repos/account';
import { UnauthorizedError } from '../errors/http';
import { ErrorCode } from '../errors/code';


const JWT_SECRET = process.env.JWT_SECRET || 'Vietnam';
const JWT_VALIDITY = 60 * 60;

const generateToken = (account: Account): string => {
    return jwt.sign(account, JWT_SECRET, {
        expiresIn: Math.ceil((+new Date()) / 1000) + JWT_VALIDITY
    });
};

const verifyToken = (token: string): jwt.JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
};

const randomizeText = (length: number): string => {
    return (Math.random() * Math.random()).toString(36) // 0.xxx
        .substring(2, length <= 2 ? 2 + length : length);
};

const getTokenFromRequest = (req: Request): string | undefined => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return;
    }
    return authorization.split(' ')[1];
};

/**
 * Validate the JSON Web Token (JWT) of the request.
 */
const jwtFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getTokenFromRequest(req);
        if (!token) throw new UnauthorizedError(req.originalUrl, ErrorCode.TOKEN_INVALID);
        const accountPayload = verifyToken(token);
        console.log(accountPayload);
        const publicAddress = accountPayload['publicAddress'];
        const nonce = accountPayload['nonce'];
        const expired = !accountPayload.exp
            ? true
            : accountPayload.exp * 1000 < +new Date();
        if (expired) throw new UnauthorizedError(req.originalUrl, ErrorCode.TOKEN_EXPIRED);
        const existed = (await AccountRepository.findByNonce(nonce))?.publicAddress === publicAddress;
        if (!existed) throw new UnauthorizedError(req.originalUrl, ErrorCode.NONCE_NOT_MATCHED);
        next();
    } catch (err) {
        next(err);
    }
};


const getAccountFromToken = (token: string): Account => {
    const accountPayload = verifyToken(token);
    const publicAddress = accountPayload['publicAddress'];
    const nonce = accountPayload['nonce'];
    return {
        publicAddress: publicAddress,
        nonce: nonce
    };
};

const getAccountFromRequest = (req: Request): Account => {
    const token = getTokenFromRequest(req);
    if (!token) throw new UnauthorizedError(req.originalUrl, ErrorCode.TOKEN_INVALID);
    return getAccountFromToken(token);
};

export {
    generateToken,
    verifyToken,
    randomizeText,
    jwtFilter,
    getAccountFromToken,
    getAccountFromRequest
};