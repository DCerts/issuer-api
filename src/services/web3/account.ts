import { EventData } from 'web3-eth-contract';
import { Transaction } from '../../utils/db';
import AccountRepository from '../../repos/account';


const processWalletActivated = async (event: EventData) => {
    const members = event.returnValues.members as string[];
    await Transaction.for(async () => {
        for (const member of members) {
            await AccountRepository.createAdmin({
                id: member
            });
        }
    });
};

export default {
    processWalletActivated
};