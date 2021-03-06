import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AccountRepository from '../repos/account';
import GroupRepository from '../repos/group';
import { UnauthorizedError } from '../errors/http';
import { ErrorCode } from '../errors/code';
import { Role } from '../models/account';
import { EMPTY, SPACE } from '../commons/str';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_VALIDITY = process.env.JWT_VALIDITY || '3600s';

const generateToken = (account: {
    id: string,
    nonce: string
}): string => {
    return jwt.sign(account, JWT_SECRET, {
        expiresIn: JWT_VALIDITY
    });
};

const verifyToken = (token: string): jwt.JwtPayload | {
    id: string,
    nonce: string,
    exp?: number
} => {
    try {
        return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch (err) {
        return {
            id: null,
            nonce: null
        };
    }
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
    return authorization.split(SPACE)[1];
};

/**
 * Validates the JSON Web Token (JWT) of the request.
 */
const jwtFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getTokenFromRequest(req);
        if (!token) throw new UnauthorizedError(req.originalUrl, ErrorCode.TOKEN_INVALID);
        const payload = verifyToken(token);
        if (!payload) throw new UnauthorizedError(req.originalUrl, ErrorCode.TOKEN_INVALID);
        const publicAddress = payload.id;
        const nonce = payload.nonce;
        const expired = !payload.exp
            ? true
            : payload.exp * 1000 < +new Date();
        if (expired) throw new UnauthorizedError(req.originalUrl, ErrorCode.TOKEN_EXPIRED);
        const existed = (await AccountRepository.findById(publicAddress))?.nonce === nonce;
        if (!existed) throw new UnauthorizedError(req.originalUrl, ErrorCode.NONCE_NOT_MATCHED);
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Permits specific role to continue requesting.
 * @param req the request
 * @param role the permission role
 */
const authorizeRole = async (req: Request, role: Role) => {
    const accountId = getAccountId(req);
    const account = await AccountRepository.findById(accountId);
    if (!account || account.role !== role) {
        throw new UnauthorizedError(req.originalUrl, ErrorCode.UNAUTHORIZED);
    }
};

const authorizeGroup = async (req: Request, groupId: number) => {
    const accountId = getAccountId(req);
    const memberIds = await GroupRepository.findMembersByGroupId(groupId);
    if (!memberIds || !memberIds.some(memberId => memberId === accountId)) {
        throw new UnauthorizedError(req.originalUrl, ErrorCode.UNAUTHORIZED);
    }
};

const authorizeSchool = async (req: Request) => {
    await authorizeRole(req, Role.SCHOOL);
};


const getAccountFromToken = (token: string): {
    id: string,
    nonce: string
} => {
    const payload = verifyToken(token);
    const id: string = payload.id || EMPTY;
    const nonce: string = payload.nonce || EMPTY;
    return {
        id: id.toLowerCase(),
        nonce: nonce
    };
};

const getAccountFromRequest = (req: Request): {
    id: string,
    nonce: string
} => {
    const token = getTokenFromRequest(req);
    if (!token) throw new UnauthorizedError(req.originalUrl, ErrorCode.TOKEN_INVALID);
    return getAccountFromToken(token);
};

const getAccountId = (req: Request) => {
    return getAccountFromRequest(req).id;
};

export const JwtUtils = {
    generateToken,
    verifyToken,
    randomizeText,
    jwtFilter,
    authorizeRole, authorizeSchool, authorizeGroup,
    getAccountFromToken, getAccountFromRequest, getAccountId
};