import { BadRequestError, InternalServerError, NotFoundError } from '../errors/http';
import { Certificate } from '../models/certificate';
import CertificateRepository from '../repos/certificate';
import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';
import { Transaction } from '../utils/db';


const findByBatchRegNo = async (batchRegNo: string) => {
    const certificates = await CertificateRepository.findByBatchRegNo(batchRegNo);
    if (!certificates) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    return certificates;
};

const findByGroupId = async (groupId: number) => {
    const certificates = await CertificateRepository.findByGroupId(groupId);
    if (!certificates) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    return certificates;
};

const findByRegNo = async (regNo: string) => {
    const certificate = await CertificateRepository.findByRegNo(regNo);
    if (!certificate) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    return certificate;
};

const create = async (certificate: Certificate) => {
    const existed = await CertificateRepository.findByRegNo(certificate.regNo);
    if (existed) {
        throw new BadRequestError(EMPTY, ErrorCode.EXISTED);
    }
    const commited = await Transaction.for(async () => {
        await CertificateRepository.create(certificate);
    });
    if (!commited) {
        throw new InternalServerError(EMPTY, ErrorCode.TRANSACTION_ERROR);
    }
};

export default {
    findByBatchRegNo,
    findByGroupId,
    findByRegNo,
    create
};