import { EventData } from 'web3-eth-contract';
import { Transaction } from '../../utils/db';
import GroupRepository from '../../repos/group';
import { CONFIRMATION_NOT_PENDING, GROUP_AVAILABLE, THRESHOLD } from '../../commons/setting';


const processGroupConfirmed = async (event: EventData) => {
    const confirmerId: string = event.returnValues.confirmer as string;
    const groupId: number = Number.parseInt(event.returnValues.groupId as string);
    await Transaction.for(async () => {
        await GroupRepository.updateConfirmation(
            groupId,
            confirmerId,
            CONFIRMATION_NOT_PENDING
        );
        const confirmers = await GroupRepository.findConfirmersByGroupId(groupId);
        if (confirmers.length >= THRESHOLD) {
            await GroupRepository.updateAvailability(groupId, GROUP_AVAILABLE);
        }
    });
};

export default {
    processGroupConfirmed: processGroupConfirmed
};