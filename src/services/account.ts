import AccountRepository from '../repos/account';
import GroupRepository from '../repos/group';
import { Account } from '../models/account';
import { BadRequestError, NotFoundError } from '../errors/http';
import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';


const findAll = async () => {
    const accounts = await AccountRepository.findAll();
    if (!accounts) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    accounts.forEach(account => {
        account.nonce = undefined;
    });
    return accounts;
};

const findById = async (id: string) => {
    const account = await AccountRepository.findById(id);
    if (!account) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    const groups = await GroupRepository.findGroupsByMemberId(id);
    account.nonce = undefined;
    account.groups = groups.map(group => group.id);
    return account;
};

const findBasicInfoById = async (id: string) => {
    const account = await AccountRepository.findById(id);
    if (!account) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    account.birthday = undefined;
    account.nonce = undefined;
    return account;
};

const create = async (account: Account) => {
    const existed = await AccountRepository.findById(account.id);
    if (existed) {
        throw new BadRequestError(EMPTY, ErrorCode.EXISTED);
    }
    await AccountRepository.create(account);
};

const updateById = async (id: string, account: Account) => {
    const existed = await AccountRepository.findById(id);
    if (!existed) {
        throw new NotFoundError(EMPTY, ErrorCode.NOT_FOUND);
    }
    await AccountRepository.updateById(id, account);
};

export default {
    findAll,
    findById,
    findBasicInfoById,
    create,
    updateById
};