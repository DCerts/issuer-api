import { Request, Router } from 'express';
import { getAccountFromRequest } from '../utils/jwt';
import issuerService from '../services/issuer';
import { BadRequestError, NotFoundError } from '../errors/http';
import { ErrorCode } from '../errors/code';
import { Issuer } from '../models/issuer';


const router = Router();

const getPublicAddress = (req: Request) => {
    return getAccountFromRequest(req).publicAddress;
};

router.get('/', async (req, res) => {
    const publicAddress = getPublicAddress(req);
    try {
        const issuer = await issuerService.findByPublicAddress(publicAddress);
        res.json(issuer);
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw new NotFoundError(req.originalUrl, ErrorCode.NOT_FOUND);
        }
    }
});

router.put('/new', async (req, res) => {
    const publicAddress = getPublicAddress(req);
    const issuer: Issuer = req.body;
    issuer.id = publicAddress;
    try {
        await issuerService.createIssuer(issuer);
        res.sendStatus(201);
    } catch (err) {
        if (err instanceof BadRequestError) {
            throw new BadRequestError(req.originalUrl, ErrorCode.EXISTED);
        }
    }
});

router.patch('/update', async (req, res) => {
    const publicAddress = getPublicAddress(req);
    const issuer: Issuer = req.body;
    issuer.id = publicAddress;
    await issuerService.updateIssuer(issuer);
    res.sendStatus(200);
});

export default router;