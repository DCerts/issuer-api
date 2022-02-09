import { EventData } from 'web3-eth-contract';
import { Transaction } from '../../utils/db';
import CertificateRepository from '../../repos/certificate';


const processCertificateAdded = async (event: EventData) => {
    const onChainId = Number.parseInt(event.returnValues.certId as string);
    const regNo = event.returnValues.regNo as string;
    await Transaction.for(async (instance: any) => {
        await CertificateRepository.updateOnChainIdByRegNo(
            regNo,
            onChainId,
            instance
        );
    });
};

const processCertificatePending = async (event: EventData) => {
    // Do nothing!
};

const processCertificateConfirmed = async (event: EventData) => {
    // Do nothing!
};

export default {
    processCertificateAdded,
    processCertificatePending,
    processCertificateConfirmed
};