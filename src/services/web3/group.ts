import { EventData } from 'web3-eth-contract';
import { Transaction } from '../../utils/db';
import GroupRepository from '../../repos/group';
import { NOT_PENDING, AVAILABLE, CONFIRMED, REJECTED } from '../../commons/setting';


const processGroupAdded = async (event: EventData) => {
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    await Transaction.for(async (instance: any) => {
        await GroupRepository.updateAvailability(groupId, AVAILABLE, instance);
    });
};

const processGroupRemoved = async (event: EventData) => {
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    await Transaction.for(async (instance: any) => {
        await GroupRepository.deleteGroupConfirmers(groupId, instance);
        await GroupRepository.deleteGroupMembers(groupId, instance);
        await GroupRepository.deleteGroup(groupId, instance);
    });
};

const processGroupPending = async (event: EventData) => {
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    const threshold = Number.parseInt(event.returnValues.threshold as string);
    const groupName = event.returnValues.name as string;
    const members = event.returnValues.members as string[];
    const creator = event.returnValues.creator as string;
    await Transaction.for(async (instance: any) => {
        await GroupRepository.create({
            id: groupId,
            name: groupName,
            threshold: threshold,
            creator: creator
        }, instance);
        await GroupRepository.addMembers(groupId, members, instance);
    });
};

const processGroupConfirmed = async (event: EventData) => {
    const confirmerId = event.returnValues.confirmer as string;
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    await Transaction.for(async (instance: any) => {
        const confirmationExisted = await GroupRepository
            .existsGroupConfirmation(groupId, confirmerId, instance);
        if (!confirmationExisted) {
            await GroupRepository.confirm(groupId, confirmerId, CONFIRMED, instance);
        }
        await GroupRepository.updateConfirmation(
            groupId,
            confirmerId,
            NOT_PENDING,
            instance
        );
    });
};

const processGroupRejected = async (event: EventData) => {
    const rejecterId = event.returnValues.rejecter as string;
    const groupId = Number.parseInt(event.returnValues.groupId as string);
    await Transaction.for(async (instance: any) => {
        const confirmationExisted = await GroupRepository
            .existsGroupConfirmation(groupId, rejecterId, instance);
        if (!confirmationExisted) {
            await GroupRepository.confirm(groupId, rejecterId, REJECTED, instance);
        }
        await GroupRepository.updateConfirmation(
            groupId,
            rejecterId,
            NOT_PENDING,
            instance
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