import { Router } from 'express';
import { Student } from '../models/student';
import StudentService from '../services/student';
import { JwtUtils } from '../utils/jwt';


const router = Router();

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const student: Student = await StudentService.findById(id);
    res.json(student);
});

router.put('/:id', async (req, res) => {
    await JwtUtils.authorizeSchool(req);
    const id = req.params.id;
    const student: Student = req.body;
    student.id = id;
    const existed = await StudentService.createOrReplace(student);
    res.sendStatus(existed ? 200 : 201);
});

router.patch('/:id', async (req, res) => {
    const student: Student = req.body;
    const id = req.params.id;
    await StudentService.updateById(id, student);
    res.sendStatus(200);
});

export default router;