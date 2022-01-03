import { Router } from 'express';
import { isSignatureValid } from '../utils/eth';
import * as jwt from '../utils/jwt';
import * as repository from '../repos/account';
import { UnauthorizedError } from '../errors/http';
import { ErrorCode } from '../errors/code';


const router = Router();

router.get('/:publicAddress/nonce', async (req, res) => {
    const publicAddress = req.params.publicAddress;
    const nonce = jwt.randomizeText(16);
    await repository.saveNonce(publicAddress, nonce);
    res.json(nonce);
});

router.post('/:publicAddress', async (req, res, next) => {
    const publicAddress = req.params.publicAddress;
    const signature = req.body.signature;
    const nonce = await repository.getNonce(publicAddress);
    try {
        if (!isSignatureValid(nonce, publicAddress, signature)) {
            throw new UnauthorizedError(req.path, ErrorCode.SIGNATURE_INVALID);
        }
        res.json(jwt.generateToken({
            publicAddress: publicAddress,
            nonce: nonce
        }));
    } catch (err) {
        next(err);
    }
});

export default router;