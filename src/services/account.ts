import AccountRepository from '../repos/account';
import { Account } from '../models/account';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/http';
import { EMPTY } from '../commons/str';


const findById = async (id: string) => {
    const account = await AccountRepository.findById(id);
    if (!account) {
        throw new NotFoundError(EMPTY);
    }
    return account;
};

const create = async (account: Account) => {
    const existed = await AccountRepository.findById(account.id);
    if (existed) {
        throw new BadRequestError(EMPTY);
    }
    await AccountRepository.create(account);
};

const updateById = async (id: string, account: Account) => {
    const existed = await AccountRepository.findById(id);
    if (!existed) {
        throw new NotFoundError(EMPTY);
    }
    await AccountRepository.updateById(id, account);
};

export default {
    findById: findById,
    create: create,
    updateById: updateById
};