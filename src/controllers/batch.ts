import { Router } from 'express';
import { Batch } from '../models/batch';
import BatchService from '../services/batch';
import { JwtUtils } from '../utils/jwt';


const router = Router();

router.get('/:regNo', async (req, res) => {
    const batchRegNo = req.params.regNo;
    const batch = await BatchService.findByBatchRegNo(batchRegNo);
    res.json(batch);
});

router.get('', async (req, res) => {
    const groupId = Number.parseInt(req.query['group_id'] as string || '');
    const batches = await BatchService.findByGroupId(groupId);
    res.json(batches);
});

router.put('/:regNo', async (req, res) => {
    const batchRegNo = req.params.regNo;
    const accountId = JwtUtils.getAccountId(req);
    const batch: Batch = req.body;
    await JwtUtils.authorizeGroup(req, batch.group);
    if (batch.certificates) {
        batch.regNo = batchRegNo;
        batch.creator = accountId;
        await BatchService.create(batch, accountId);
        res.sendStatus(201);
    }
    else {
        await BatchService.confirm(batchRegNo, accountId, true);
        res.sendStatus(200);
    }
});

router.delete('/:regNo', async (req, res) => {
    const batchRegNo = req.params.regNo;
    const accountId = JwtUtils.getAccountId(req);
    const groupId = (await BatchService.findByBatchRegNo(batchRegNo)).group;
    await JwtUtils.authorizeGroup(req, groupId);
    await BatchService.confirm(batchRegNo, accountId, false);
    res.sendStatus(200);
});

export default router;