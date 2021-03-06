import { BadRequestError, InternalServerError, NotFoundError } from '../errors/http';
import { Group } from '../models/group';
import GroupRepository from '../repos/group';
import AccountRepository from '../repos/account';
import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';
import { Transaction } from '../utils/db';
import { CONFIRMED, REJECTED } from '../commons/setting';


const findByGroupId = async (groupId: number) => {
    const group = await GroupRepository.findByGroupId(groupId);
    if (!group) throw new NotFoundError(EMPTY, ErrorCode.GROUP_NOT_FOUND);
    const members = await GroupRepository.findMembersByGroupId(groupId);
    group.members = members;
    return group;
};

const findGroupsByMemberId = async (memberId: string) => {
    return GroupRepository.findGroupsByMemberId(memberId);
};

const create = async (group: Group, accountId: string) => {
    const existed = await GroupRepository.findByGroupId(group.id);
    if (existed) {
        throw new BadRequestError(EMPTY, ErrorCode.EXISTED);
    }
    if (!group.members || !group.members.length) {
        throw new BadRequestError(EMPTY, ErrorCode.MEMBER_MISSING);
    }
    if (group.members.length < group.threshold) {
        throw new BadRequestError(EMPTY, ErrorCode.THRESHOLD_INVALID);
    }
    for (const member of group.members) {
        const account = await AccountRepository.findById(member);
        if (!account) {
            throw new NotFoundError(EMPTY, ErrorCode.ACCOUNT_NOT_FOUND);
        }
    }
    const commited = await Transaction.for(async (instance: any) => {
        await GroupRepository.create(group, instance);
        const members = group.members || [];
        await GroupRepository.addMembers(group.id, members, instance);
        await GroupRepository.confirm(
            group.id,
            accountId,
            CONFIRMED,
            instance
        );
    });
    if (!commited) {
        throw new InternalServerError(EMPTY, ErrorCode.TRANSACTION_ERROR);
    }
};

const confirm = async (groupId: number, confirmerId: string, confirmed: boolean) => {
    const group = await GroupRepository.findByGroupId(groupId);
    if (!group) throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    if (group.available) throw new BadRequestError(EMPTY, ErrorCode.GROUP_ALREADY_AVAILABLE);
    const confirmers = await GroupRepository.findConfirmersByGroupId(groupId);
    if (!confirmers || !confirmers.includes(confirmerId)) {
        await GroupRepository.confirm(
            groupId,
            confirmerId,
            confirmed ? CONFIRMED : REJECTED
        );
    }
};

export default {
    findByGroupId: findByGroupId,
    findGroupsByMemberId: findGroupsByMemberId,
    create: create,
    confirm: confirm
};