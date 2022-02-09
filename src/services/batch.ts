import { BadRequestError, InternalServerError, NotFoundError } from '../errors/http';
import { Batch } from '../models/batch';
import BatchRepository from '../repos/batch';
import CertificateRepository from '../repos/certificate';
import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';
import { Transaction } from '../utils/db';
import { CONFIRMED, REJECTED } from '../commons/setting';


const findByBatchRegNo = async (regNo: string) => {
    const batch = await BatchRepository.findByBatchRegNo(regNo);
    if (!batch) throw new NotFoundError(EMPTY, ErrorCode.BATCH_NOT_FOUND);
    const certificates = await CertificateRepository.findByBatchRegNo(regNo);
    batch.certificates = certificates;
    return batch;
};

const findByGroupId = async (groupId: number) => {
    const batches = await BatchRepository.findByGroupId(groupId);
    if (!batches) throw new NotFoundError(EMPTY, ErrorCode.BATCH_NOT_FOUND);
    return batches;
};

const create = async (batch: Batch, accountId: string) => {
    const existed = await BatchRepository.findByBatchRegNo(batch.regNo);
    if (existed) {
        throw new BadRequestError(EMPTY, ErrorCode.EXISTED);
    }
    if (!batch.certificates.length) {
        throw new BadRequestError(EMPTY, ErrorCode.CERTIFICATE_MISSING);
    }
    const commited = await Transaction.for(async (instance: any) => {
        await BatchRepository.create(batch, instance);
        for (const certificate of batch.certificates) {
            certificate.batchRegNo = batch.regNo;
            await CertificateRepository.create(certificate, instance);
        }
        await BatchRepository.confirm(
            batch.regNo,
            accountId,
            CONFIRMED,
            instance
        );
    });
    if (!commited) {
        throw new InternalServerError(EMPTY, ErrorCode.TRANSACTION_ERROR);
    }
};

const confirm = async (batchRegNo: string, confirmerId: string, confirmed: boolean) => {
    const batch = await BatchRepository.findByBatchRegNo(batchRegNo);
    if (!batch) throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    if (batch.issued) throw new BadRequestError(EMPTY, ErrorCode.BATCH_ALREADY_ISSUED);
    const confirmers = await BatchRepository.findConfirmersByBatchRegNo(batchRegNo);
    if (!confirmers || !confirmers.includes(confirmerId)) {
        await BatchRepository.confirm(
            batchRegNo,
            confirmerId,
            confirmed ? CONFIRMED : REJECTED
        );
    }
};

export default {
    findByBatchRegNo,
    findByGroupId,
    create,
    confirm
};