import { Request, Router } from 'express';
import { UnauthorizedError } from '../errors/http';
import { ErrorCode } from '../errors/code';
import { Account } from '../models/account';
import accountService from '../services/account';
import { getAccountFromRequest } from '../utils/jwt';


const router = Router();

const getPublicAddress = (req: Request) => {
    return getAccountFromRequest(req).publicAddress;
};

router.get('/', async (req, res) => {
    const publicAddress = getPublicAddress(req);
    try {
        const account: Account = await accountService.findByPublicAddress(publicAddress);
        res.json({
            publicAddress: account.publicAddress,
            role: account.role
        });
    } catch (err) {
        if (err instanceof UnauthorizedError) {
            throw new UnauthorizedError(req.originalUrl, ErrorCode.NOT_FOUND);
        }
    }
});

export default router;