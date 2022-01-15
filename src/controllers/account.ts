import { Request, Router } from 'express';
import { Account } from '../models/account';
import AccountService from '../services/account';
import { authorizeSchool, getAccountFromRequest } from '../utils/jwt';


const router = Router();

const getAccountId = (req: Request) => {
    return getAccountFromRequest(req).id;
};

router.get('/', async (req, res) => {
    const id = getAccountId(req);
    const account: Account = await AccountService.findById(id);
    account.nonce = undefined; // nonce is hidden
    res.json(account);
});

router.put('/:accountId', async (req, res) => {
    await authorizeSchool(req);
    const accountId = req.params.accountId;
    const account: Account = req.body;
    account.id = accountId;
    await AccountService.create(account);
    res.sendStatus(201);
});

export default router;