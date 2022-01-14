import { BadRequestError, NotFoundError } from '../errors/http';
import { Group } from '../models/group';
import GroupRepository from '../repos/group';


const findByGroupId = async (groupId: number) => {
    const group = await GroupRepository.findByGroupId(groupId);
    if (!group) {
        throw new NotFoundError('');
    }
    return group;
};

const create = async (group: Group, accountId: string | undefined) => {
    const existed = await GroupRepository.findByGroupId(group.id);
    if (existed) {
        throw new BadRequestError('');
    }
    await GroupRepository.create(group);
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

export default {
    findByGroupId: findByGroupId,
    create: create,
    confirm: confirm
};