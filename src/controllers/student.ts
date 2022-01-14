import { Request, Router } from 'express';
import { BadRequestError, NotFoundError, NotImplementedError, UnauthorizedError } from '../errors/http';
import { ErrorCode } from '../errors/code';
import { Student } from '../models/student';
import StudentService from '../services/student';
import { getAccountFromRequest } from '../utils/jwt';


const router = Router();

const getPublicAddress = (req: Request) => {
    return getAccountFromRequest(req).id;
};

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const student: Student = await StudentService.findById(id);
        res.json(student);
    } catch (err) {
        if (err instanceof NotFoundError) {
            throw new NotFoundError(req.originalUrl, ErrorCode.NOT_FOUND);
        }
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const student: Student = req.body;
    try {
        student.id = id;
        await StudentService.create(student);
        res.sendStatus(201);
    } catch (err) {
        if (err instanceof BadRequestError) {
            await StudentService.replaceById(id, student);
            res.sendStatus(200);
        }
        else {
            throw new BadRequestError(req.originalUrl, ErrorCode.UNKNOWN);
        }
    }
});

router.patch('/:id', async (req, res) => {
    const student: Student = req.body;
    const id = req.params.id;
    try {
        await StudentService.updateById(id, student);
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