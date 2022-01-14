import { Router } from 'express';
import { BadRequestError, NotFoundError, NotImplementedError } from '../errors/http';
import { ErrorCode } from '../errors/code';
import { Subject } from '../models/subject';
import SubjectService from '../services/subject';


const router = Router();

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const subject: Subject = await SubjectService.findById(id);
        res.json(subject);
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw new NotFoundError(req.originalUrl, ErrorCode.NOT_FOUND);
        }
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const subject: Subject = req.body;
    try {
        subject.id = id;
        await SubjectService.create(subject);
        res.sendStatus(201);
    } catch (err) {
        if (err instanceof BadRequestError) {
            await SubjectService.replaceById(id, subject);
            res.sendStatus(200);
        }
        else {
            throw new BadRequestError(req.originalUrl, ErrorCode.UNKNOWN);
        }
    }
});

router.patch('/:id', async (req, res) => {
    const subject: Subject = req.body;
    const id = req.params.id;
    try {
        await SubjectService.updateById(id, subject);
        res.sendStatus(200);
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw new NotFoundError(req.originalUrl, ErrorCode.NOT_FOUND);
        }
    }
});

router.delete('/:id', async (req, res) => {
    throw new NotImplementedError(req.originalUrl, ErrorCode.NOT_IMPLEMENTED);
});

export default router;