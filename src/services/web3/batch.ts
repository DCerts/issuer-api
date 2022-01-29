import { EventData } from 'web3-eth-contract';
import { Transaction } from '../../utils/db';
import BatchRepository from '../../repos/batch';
import { NOT_PENDING, ISSUED } from '../../commons/setting';
import { Certificate } from '../../models/certificate';


const processBatchAdded = async (event: EventData) => {
    const batchId = Number.parseInt(event.returnValues.batchId as string);
    await Transaction.for(async () => {
        await BatchRepository.updateIssuance(batchId, ISSUED);
    });
};

const processBatchPending = async (event: EventData) => {
    const batchId = Number.parseInt(event.returnValues.batchId as string);
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    const batchName = event.returnValues.name as string;
    const certificates = event.returnValues.certs as Certificate[];
    const creator = event.returnValues.creator as string;
    await Transaction.for(async () => {
        await BatchRepository.create({
            id: batchId,
            name: batchName,
            group: groupId,
            creator: creator,
            certificates: certificates
        });
    });
};

const processBatchConfirmed = async (event: EventData) => {
    const confirmerId = event.returnValues.confirmer as string;
    const batchId = Number.parseInt(event.returnValues.batchId as string);
    await Transaction.for(async () => {
        await BatchRepository.updateConfirmation(
            batchId,
            confirmerId,
            NOT_PENDING
        );
    });
};

export default {
    processBatchAdded,
    processBatchPending,
    processBatchConfirmed
};