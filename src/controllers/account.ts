import { Router } from 'express';
import { Account } from '../models/account';
import AccountService from '../services/account';
import { authorizeSchool, getAccountId } from '../utils/jwt';


const router = Router();

router.get('/all', async (req, res) => {
    await authorizeSchool(req);
    const accounts = await AccountService.findAll();
    res.json(accounts);
});

router.get('/', async (req, res) => {
    const id = getAccountId(req);
    const account: Account = await AccountService.findById(id);
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