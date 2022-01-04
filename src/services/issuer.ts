import { Router } from 'express';
import { getAccountFromRequest } from '../utils/jwt';
import IssuerRepository from '../repos/issuer';


const router = Router();

router.get('/', async (req, res) => {
    const publicAddress = getAccountFromRequest(req).publicAddress;
    const issuer = await IssuerRepository.findByPublicAddress(publicAddress);
    if (!issuer) {
        res.status(404).json('Hello World!');
    }
    res.json(issuer);
});

export default router;