import { Request, Router } from 'express';
import { Group } from '../models/group';
import GroupService from '../services/group';
import { getAccountFromRequest, authorizeSchool } from '../utils/jwt';


const router = Router();

const getAccountId = (req: Request) => {
    return getAccountFromRequest(req).id;
};

router.get('/:groupId', async (req, res) => {
    const groupId: number = Number.parseInt(req.params.groupId);
    const group: Group = await GroupService.findByGroupId(groupId);
    res.json(group);
});

router.get('/', async (req, res) => {
    const accountId = getAccountId(req);
    const groups = await GroupService.findGroupsByMemberId(accountId);
    res.json(groups);
});

router.put('/:groupId', async (req, res) => {
    await authorizeSchool(req);
    const groupId: number = Number.parseInt(req.params.groupId);
    const accountId = getAccountId(req);
    const group: Group = req.body;
    if (group.threshold) {
        group.id = groupId;
        await GroupService.create(group, accountId);
        res.sendStatus(201);
    } else {
        await GroupService.confirm(groupId, accountId);
        res.sendStatus(200);
    }
});

export default router;