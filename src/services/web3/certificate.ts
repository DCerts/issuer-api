import { EventData } from 'web3-eth-contract';
import { Transaction } from '../../utils/db';
import CertificateRepository from '../../repos/certificate';


const processCertificateAdded = async (event: EventData) => {
    // Do nothing!
};

const processCertificatePending = async (event: EventData) => {
    const onChainId = Number.parseInt(event.returnValues.certificateId as string);
    const regNo = event.returnValues.regNo as string;
    await Transaction.for(async () => {
        await CertificateRepository.updateOnChainIdByRegNo(
            regNo,
            onChainId
        );
    });
};

const processCertificateConfirmed = async (event: EventData) => {
    // Do nothing!
};

export default {
    processCertificateAdded,
    processCertificatePending,
    processCertificateConfirmed
};