import { Router } from 'express';
import { Student } from '../models/student';
import studentService from '../services/student';


const router = Router();

router.get('/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    const student = await studentService.findByStudentId(studentId);
    res.json(student);
});

router.put('/new', async (req, res) => {
    const student: Student = req.body;
    await studentService.createStudent(student);
    res.sendStatus(201);
});

router.patch('/update', async (req, res) => {
    const student: Student = req.body;
    await studentService.saveStudent(student);
    res.sendStatus(200);
});

export default router;