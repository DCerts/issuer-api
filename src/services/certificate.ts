import { BadRequestError, NotFoundError } from '../errors/http';
import { Certificate } from '../models/certificate';
import CertificateRepository from '../repos/certificate';
import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';
import { Transaction } from '../utils/db';


const findByBatchRegNo = async (regNo: string) => {
    const certificates = await CertificateRepository.findByBatchRegNo(regNo);
    if (!certificates) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    return certificates;
};

const create = async (certificate: Certificate) => {
    const existed = await CertificateRepository.findByRegNo(certificate.regNo);
    if (existed) {
        throw new BadRequestError(EMPTY, ErrorCode.EXISTED);
    }
    await Transaction.for(async () => {
        await CertificateRepository.create(certificate);
    });
};

export default {
    findByBatchRegNo,
    create
};