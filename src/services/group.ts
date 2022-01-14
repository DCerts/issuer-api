import { BadRequestError, NotFoundError } from '../errors/http';
import { Account } from '../models/account';
import { Group } from '../models/group';
import GroupRepository from '../repos/group';
import AccountRepository from '../repos/account';


const findByGroupId = async (groupId: number) => {
    const group = await GroupRepository.findByGroupId(groupId);
    if (!group) throw new NotFoundError('');
    const members = await GroupRepository.findMembersByGroupId(groupId);
    group.members = members;
    return group;
};

const create = async (group: Group, accountId: string | undefined) => {
    const existed = await GroupRepository.findByGroupId(group.id);
    if (existed) {
        throw new BadRequestError('');
    }
    await GroupRepository.create(group);
    // TODO: Send notification to other school account.
    if (accountId) await GroupRepository.confirm(group.id, accountId);
};

const confirm = async (groupId: number, confirmerId: string) => {
    const group = await GroupRepository.findByGroupId(groupId);
    if (!group) throw new NotFoundError('');
    if (group.available) throw new BadRequestError('');
    const confirmers = await GroupRepository.findConfirmersByGroupId(groupId);
    if (!confirmers || !confirmers.includes(confirmerId)) {
        await GroupRepository.confirm(groupId, confirmerId);
        if (group.threshold <= (confirmers || []).length + 1) {
            await GroupRepository.updateAvailability(groupId, true);
        }
    }
};

const addMembers = async (groupId: number, members: Account[]) => {
    const group = await GroupRepository.findByGroupId(groupId);
    if (!group) throw new NotFoundError('');
    const memberIds = await GroupRepository.findMembersByGroupId(groupId);
    const availableMembers = memberIds
        ? members.filter(member => !memberIds.includes(member.id))
        : members;
    await GroupRepository.addMembers(
        groupId,
        ...availableMembers.map(member => member.id)
    );
    // TODO: Send mail to notify group invitation.
    for (const member of availableMembers) {
        const account = await AccountRepository.findById(member.id);
        if (!account) {
            await AccountRepository.create(member);
            // TODO: Send mail to notify account creation.
        }
    }
};

export default {
    findByGroupId: findByGroupId,
    create: create,
    confirm: confirm,
    addMembers: addMembers
};