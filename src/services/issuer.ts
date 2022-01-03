import { Router } from 'express';
import { getAccountFromRequest } from '../utils/jwt';
import * as repository from '../repos/issuer';
import { NotFoundError } from '../errors/http';
import { ErrorCode } from '../errors/code';


const router = Router();

router.get('/', async (req, res) => {
    const id = getAccountFromRequest(req).publicAddress;
    if (await repository.hasIssuerExisted(id)) {
        const issuer = await repository.getIssuer(id);
        res.json(issuer);
    }
    else {
        throw new NotFoundError(req.originalUrl, ErrorCode.NOT_FOUND);
    }
});

export default router;