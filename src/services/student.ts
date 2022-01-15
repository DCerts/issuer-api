import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';
import { BadRequestError, NotFoundError } from '../errors/http';
import { Student } from '../models/student';
import StudentRepository from '../repos/student';


const findById = async (id: string) => {
    const student = await StudentRepository.findById(id);
    if (!student) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    return student;
};

const create = async (student: Student) => {
    const existed = await StudentRepository.findById(student.id);
    if (existed) {
        throw new BadRequestError(EMPTY, ErrorCode.EXISTED);
    }
    await StudentRepository.create(student);
};

const updateById = async (id: string, student: Student) => {
    const existed = await StudentRepository.findById(id);
    if (!existed) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
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
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    await StudentRepository.updateById(id, student);
};

const createOrReplace = async (student: Student) => {
    const existed = await StudentRepository.findById(student.id);
    if (!existed) {
        await StudentRepository.create(student);
    }
    else {
        await StudentRepository.updateById(student.id, student);
    }
    return existed;
}

export default {
    findById: findById,
    create: create,
    updateById: updateById,
    replaceById: replaceById,
    createOrReplace: createOrReplace
};