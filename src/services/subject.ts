import SubjectRepository from '../repos/subject';
import { Subject } from '../models/subject';
import { BadRequestError, NotFoundError } from '../errors/http';


const findBySubjectId = async (subjectId: string) => {
    const subject = await SubjectRepository.findBySubjectId(subjectId);
    if (!subject) {
        throw new NotFoundError('');
    }
    return subject;
};

const createSubject = async (subject: Subject) => {
    const subjectExists = await SubjectRepository.findBySubjectId(subject.id);
    if (subjectExists) {
        throw new BadRequestError('');
    }
    await SubjectRepository.create(subject);
};

const saveSubject = async (subject: Subject) => {
    await SubjectRepository.save(subject);
};

export default {
    findBySubjectId: findBySubjectId,
    createSubject: createSubject,
    saveSubject: saveSubject
};