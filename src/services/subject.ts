import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';
import { BadRequestError, NotFoundError } from '../errors/http';
import { Subject } from '../models/subject';
import SubjectRepository from '../repos/subject';


const findById = async (id: string) => {
    const subject = await SubjectRepository.findById(id);
    if (!subject) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    return subject;
};

const create = async (subject: Subject) => {
    const existed = await SubjectRepository.findById(subject.id);
    if (existed) {
        throw new BadRequestError(EMPTY, ErrorCode.EXISTED);
    }
    await SubjectRepository.create(subject);
};

const updateById = async (id: string, subject: Subject) => {
    const existed = await SubjectRepository.findById(id);
    if (!existed) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
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
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    await SubjectRepository.updateById(id, subject);
};

const createOrReplace = async (subject: Subject) => {
    const existed = await SubjectRepository.findById(subject.id);
    if (!existed) {
        await SubjectRepository.create(subject);
    }
    else {
        await SubjectRepository.updateById(subject.id, subject);
    }
    return existed;
};

export default {
    findById: findById,
    create: create,
    updateById: updateById,
    replaceById: replaceById,
    createOrReplace: createOrReplace
};