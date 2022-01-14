import { BadRequestError, NotFoundError } from '../errors/http';
import { Subject } from '../models/subject';
import SubjectRepository from '../repos/subject';


const findById = async (id: string) => {
    const subject = await SubjectRepository.findById(id);
    if (!subject) {
        throw new NotFoundError('');
    }
    return subject;
};

const create = async (subject: Subject) => {
    const existed = await SubjectRepository.findById(subject.id);
    if (existed) {
        throw new BadRequestError('');
    }
    await SubjectRepository.create(subject);
};

const updateById = async (id: string, subject: Subject) => {
    const existed = await SubjectRepository.findById(id);
    if (!existed) {
        throw new NotFoundError('');
    }
    await SubjectRepository.updateById(id, {
        id: id,
        name: subject.name || existed.name,
        description: subject.description || existed.description
    });
};

const replaceById = async (id: string, subject: Subject) => {
    const existed = await SubjectRepository.findById(id);
    if (!existed) {
        throw new NotFoundError('');
    }
    await SubjectRepository.updateById(id, subject);
};

export default {
    findById: findById,
    create: create,
    updateById: updateById,
    replaceById: replaceById
};