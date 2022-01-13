import AccountRepository from '../repos/account';
import { Account } from '../models/account';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/http';


const findById = async (id: string) => {
    const account = await AccountRepository.findById(id);
    if (!account) {
        throw new NotFoundError('');
    }
    return account;
};

export default {
    findById: findById
};