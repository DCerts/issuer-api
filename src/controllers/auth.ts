import { Request, Router } from 'express';
import AuthService from '../services/auth';
import { getAccountFromRequest } from '../utils/jwt';


const router = Router();

const getAccountId = (req: Request) => {
    return getAccountFromRequest(req).id;
};

router.get('/:publicAddress/nonce', async (req, res) => {
    const publicAddress = req.params.publicAddress.toLowerCase();
    const nonce = await AuthService.getNonce(publicAddress);
    res.json(nonce);
});

router.post('/:publicAddress', async (req, res) => {
    const publicAddress = req.params.publicAddress.toLowerCase();
    const signature = req.body.signature;
    const token = await AuthService.validateSignature(publicAddress, signature);
    res.json(token);
});

router.delete('/', async (req, res) => {
    const id = getAccountId(req);
    await AuthService.logout(id);
    res.sendStatus(200);
});

export default router;