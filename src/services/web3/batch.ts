import { EventData } from 'web3-eth-contract';
import { Transaction } from '../../utils/db';
import BatchRepository from '../../repos/batch';
import { NOT_PENDING, ISSUED } from '../../commons/setting';


const processBatchAdded = async (event: EventData) => {
    const regNo = event.returnValues.regNo as string;
    await Transaction.for(async () => {
        await BatchRepository.updateIssuance(regNo, ISSUED);
    });
};

const processBatchPending = async (event: EventData) => {
    const onChainId = Number.parseInt(event.returnValues.batchId as string);
    const regNo = event.returnValues.regNo as string;
    await Transaction.for(async () => {
        await BatchRepository.updateOnChainId(
            regNo,
            onChainId
        );
    });
};

const processBatchConfirmed = async (event: EventData) => {
    const confirmerId = event.returnValues.confirmer as string;
    const regNo = event.returnValues.regNo as string;
    await Transaction.for(async () => {
        await BatchRepository.updateConfirmation(
            regNo,
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