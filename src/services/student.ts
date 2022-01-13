import StudentRepository from '../repos/student';
import { Student } from '../models/student';
import { BadRequestError, NotFoundError } from '../errors/http';


const findByStudentId = async (studentId: string) => {
    const student = await StudentRepository.findByStudentId(studentId);
    if (!student) {
        throw new NotFoundError('');
    }
    return student;
};

const createStudent = async (student: Student) => {
    const studentExists = await StudentRepository.findByStudentId(student.id);
    if (studentExists) {
        throw new BadRequestError('');
    }
    await StudentRepository.create(student);
};

const saveStudent = async (student: Student) => {
    await StudentRepository.save(student);
};

export default {
    findByStudentId: findByStudentId,
    createStudent: createStudent,
    saveStudent: saveStudent
};