import { Router } from 'express';
import { NotFoundError, UnauthorizedError } from '../errors/http';
import { ErrorCode } from '../errors/code';
import authService from '../services/auth';


const router = Router();

router.get('/:publicAddress/nonce', async (req, res) => {
    const publicAddress = req.params.publicAddress;
    try {
        const nonce = await authService.getNonce(publicAddress);
        res.json(nonce);
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw new NotFoundError(req.originalUrl, ErrorCode.NOT_FOUND);
        }
    }
});

router.post('/:publicAddress', async (req, res) => {
    const publicAddress = req.params.publicAddress;
    const signature = req.body.signature;
    try {
        const token = await authService.validateSignature(publicAddress, signature);
        res.json(token);
    } catch (err) {
        if (err instanceof UnauthorizedError) {
            throw new UnauthorizedError(req.originalUrl, ErrorCode.UNAUTHORIZED);
        }
    }
});

export default router;