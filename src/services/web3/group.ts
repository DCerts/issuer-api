import { EventData } from 'web3-eth-contract';
import { Transaction } from '../../utils/db';
import GroupRepository from '../../repos/group';
import { NOT_PENDING, AVAILABLE, CONFIRMED, REJECTED } from '../../commons/setting';


const processGroupAdded = async (event: EventData) => {
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    await Transaction.for(async () => {
        await GroupRepository.updateAvailability(groupId, AVAILABLE);
    });
};

const processGroupRemoved = async (event: EventData) => {
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    await Transaction.for(async () => {
        await GroupRepository.deleteGroupConfirmers(groupId);
        await GroupRepository.deleteGroupMembers(groupId);
        await GroupRepository.deleteGroup(groupId);
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
        const confirmationExisted = await GroupRepository
            .existsGroupConfirmation(groupId, confirmerId);
        if (!confirmationExisted) {
            await GroupRepository.confirm(groupId, confirmerId, CONFIRMED);
        }
        await GroupRepository.updateConfirmation(
            groupId,
            confirmerId,
            NOT_PENDING
        );
    });
};

const processGroupRejected = async (event: EventData) => {
    const rejecterId = event.returnValues.rejecter as string;
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    await Transaction.for(async () => {
        const confirmationExisted = await GroupRepository
            .existsGroupConfirmation(groupId, rejecterId);
        if (!confirmationExisted) {
            await GroupRepository.confirm(groupId, rejecterId, REJECTED);
        }
        await GroupRepository.updateConfirmation(
            groupId,
            rejecterId,
            NOT_PENDING
        );
    });
};

export default {
    processGroupAdded,
    processGroupRemoved,
    processGroupPending,
    processGroupConfirmed,
    processGroupRejected
};