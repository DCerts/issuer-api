import { Request, Router } from 'express';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/http';
import { ErrorCode } from '../errors/code';
import { Group } from '../models/group';
import GroupService from '../services/group';
import { getAccountFromRequest, authorizeSchool } from '../utils/jwt';
import { Account } from '../models/account';


const router = Router();

const getAccountId = (req: Request) => {
    return getAccountFromRequest(req).id;
};

router.get('/:groupId', async (req, res) => {
    const groupId: number = Number.parseInt(req.params.groupId);
    try {
        const group: Group = await GroupService.findByGroupId(groupId);
        res.json(group);
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw new NotFoundError(req.originalUrl, ErrorCode.NOT_FOUND);
        }
    }
});

router.put('/:groupId', async (req, res) => {
    await authorizeSchool(req);
    const groupId: number = Number.parseInt(req.params.groupId);
    const accountId = getAccountId(req);
    const group: Group = req.body;
    try {
        if (group.threshold) {
            group.id = groupId;
            await GroupService.create(group, accountId);
            res.sendStatus(201);
        } else {
            await GroupService.confirm(groupId, accountId);
            res.sendStatus(200);
        }
    } catch (err) {
        if (err instanceof BadRequestError) {
            throw new BadRequestError(req.originalUrl, err.code);
        }
        if (err instanceof NotFoundError) {
            throw new NotFoundError(req.originalUrl, err.code);
        }
    }
});

export default router;