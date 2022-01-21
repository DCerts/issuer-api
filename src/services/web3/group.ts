import { EventData } from 'web3-eth-contract';
import { Transaction } from '../../utils/db';
import GroupRepository from '../../repos/group';
import { CONFIRMATION_NOT_PENDING, GROUP_AVAILABLE } from '../../commons/setting';


const processGroupAdded = async (event: EventData) => {
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    await Transaction.for(async () => {
        await GroupRepository.updateAvailability(groupId, GROUP_AVAILABLE);
    });
};

const processGroupPending = async (event: EventData) => {
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    const threshold = Number.parseInt(event.returnValues.threshold as string);
    const groupName = event.returnValues.name as string;
    const members = event.returnValues.members as string[];
    const creator = event.returnValues.creator as string;
    await Transaction.for(async () => {
        await GroupRepository.create({
            id: groupId,
            name: groupName,
            threshold: threshold,
            creator: creator
        });
        await GroupRepository.addMembers(groupId, ...members);
    });
};

const processGroupConfirmed = async (event: EventData) => {
    const confirmerId = event.returnValues.confirmer as string;
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    await Transaction.for(async () => {
        await GroupRepository.updateConfirmation(
            groupId,
            confirmerId,
            CONFIRMATION_NOT_PENDING
        );
    });
};

export default {
    processGroupAdded,
    processGroupPending,
    processGroupConfirmed
};