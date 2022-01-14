import { BadRequestError, NotFoundError } from '../errors/http';
import { Student } from '../models/student';
import StudentRepository from '../repos/student';


const findById = async (id: string) => {
    const student = await StudentRepository.findById(id);
    if (!student) {
        throw new NotFoundError('');
    }
    return student;
};

const create = async (student: Student) => {
    const existed = await StudentRepository.findById(student.id);
    if (existed) {
        throw new BadRequestError('');
    }
    await StudentRepository.create(student);
};

const updateById = async (id: string, student: Student) => {
    const existed = await StudentRepository.findById(id);
    if (!existed) {
        throw new NotFoundError('');
    }
    await StudentRepository.updateById(id, {
        id: id,
        name: student.name || existed.name,
        birthday: student.birthday || existed.birthday,
        email: student.email || existed.email,
    });
};

const replaceById = async (id: string, student: Student) => {
    const existed = await StudentRepository.findById(id);
    if (!existed) {
        throw new NotFoundError('');
    }
    await StudentRepository.updateById(id, student);
};

export default {
    findById: findById,
    create: create,
    updateById: updateById,
    replaceById: replaceById
};