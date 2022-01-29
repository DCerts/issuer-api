import { BadRequestError, NotFoundError } from '../errors/http';
import { Batch } from '../models/batch';
import BatchRepository from '../repos/batch';
import CertificateRepository from '../repos/certificate';
import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';
import { Transaction } from '../utils/db';
import { CONFIRMED, REJECTED } from '../commons/setting';


const findByBatchId = async (batchId: number) => {
    const batch = await BatchRepository.findByBatchId(batchId);
    if (!batch) throw new NotFoundError(EMPTY, ErrorCode.BATCH_NOT_FOUND);
    const certificates = await CertificateRepository.findByBatchId(batchId)
    batch.certificates = certificates;
    return batch;
};

const create = async (batch: Batch, accountId: string) => {
    const existed = await BatchRepository.findByBatchId(batch.id);
    if (existed) {
        throw new BadRequestError(EMPTY, ErrorCode.EXISTED);
    }
    if (batch.certificates.length) {
        throw new BadRequestError(EMPTY, ErrorCode.CERTIFICATE_MISSING);
    }
    await Transaction.for(async () => {
        await BatchRepository.create(batch);
        for (const certificate of batch.certificates) {
            certificate.batchId = batch.id;
            await CertificateRepository.create(certificate);
        }
        await BatchRepository.confirm(
            batch.id,
            accountId,
            CONFIRMED
        );
    });
};

const confirm = async (batchId: number, confirmerId: string, confirmed: boolean) => {
    const batch = await BatchRepository.findByBatchId(batchId);
    if (!batch) throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    if (batch.issued) throw new BadRequestError(EMPTY, ErrorCode.BATCH_ALREADY_ISSUED);
    const confirmers = await BatchRepository.findConfirmersByBatchId(batchId);
    if (!confirmers || !confirmers.includes(confirmerId)) {
        await BatchRepository.confirm(
            batchId,
            confirmerId,
            confirmed ? CONFIRMED : REJECTED
        );
    }
};

export default {
    findByBatchId,
    create,
    confirm
};