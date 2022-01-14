import { Request, Router } from 'express';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/http';
import { ErrorCode } from '../errors/code';
import { Account, Role } from '../models/account';
import AccountService from '../services/account';
import { getAccountFromRequest } from '../utils/jwt';


const router = Router();

const getAccountId = (req: Request) => {
    return getAccountFromRequest(req).id;
};

router.get('/', async (req, res) => {
    const id = getAccountId(req);
    try {
        const account: Account = await AccountService.findById(id);
        res.json({
            id: account.id,
            role: account.role
        });
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw new NotFoundError(req.originalUrl, ErrorCode.NOT_FOUND);
        }
    }
});

router.put('/:accountId', async (req, res) => {
    const id = getAccountId(req);
    const role = (await AccountService.findById(id)).role;
    if (role !== Role.SCHOOL) {
        throw new UnauthorizedError(req.originalUrl, ErrorCode.UNAUTHORIZED);
    }
    const accountId = req.params.accountId;
    const account: Account = req.body;
    try {
        account.id = accountId;
        await AccountService.create(account);
        res.sendStatus(201);
    } catch (err) {
        if (err instanceof BadRequestError) {
            throw new BadRequestError(req.originalUrl, ErrorCode.EXISTED);
        }
    }
});

export default router;