import { Router } from 'express';
import AuthService from '../services/auth';


const router = Router();

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

export default router;