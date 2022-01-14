import { Request, Router } from 'express';
import { NotFoundError, UnauthorizedError } from '../errors/http';
import { ErrorCode } from '../errors/code';
import { Account } from '../models/account';
import AccountService from '../services/account';
import { getAccountFromRequest } from '../utils/jwt';


const router = Router();

const getPublicAddress = (req: Request) => {
    return getAccountFromRequest(req).id;
};

router.get('/', async (req, res) => {
    const publicAddress = getPublicAddress(req);
    try {
        const account: Account = await AccountService.findById(publicAddress);
        res.json({
            publicAddress: account.id,
            role: account.role
        });
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw new NotFoundError(req.originalUrl, ErrorCode.NOT_FOUND);
        }
    }
});

export default router;