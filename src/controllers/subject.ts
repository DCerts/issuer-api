import { Router } from 'express';
import { Subject } from '../models/subject';
import subjectService from '../services/subject';


const router = Router();

router.get('/:subjectId', async (req, res) => {
    const subjectId = req.params.subjectId;
    const subject = await subjectService.findBySubjectId(subjectId);
    res.json(subject);
});

router.put('/new', async (req, res) => {
    const subject: Subject = req.body;
    await subjectService.createSubject(subject);
    res.sendStatus(201);
});

router.patch('/update', async (req, res) => {
    const subject: Subject = req.body;
    await subjectService.saveSubject(subject);
    res.sendStatus(200);
});

export default router;