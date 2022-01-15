import { Router } from 'express';
import { Subject } from '../models/subject';
import SubjectService from '../services/subject';


const router = Router();

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const subject: Subject = await SubjectService.findById(id);
    res.json(subject);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const subject: Subject = req.body;
    subject.id = id;
    const existed = await SubjectService.createOrReplace(subject);
    res.sendStatus(existed ? 200 : 201);
});

router.patch('/:id', async (req, res) => {
    const subject: Subject = req.body;
    const id = req.params.id;
    await SubjectService.updateById(id, subject);
    res.sendStatus(200);
});

export default router;