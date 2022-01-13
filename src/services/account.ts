import AccountRepository from '../repos/account';
import { Account } from '../models/account';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/http';


const findByPublicAddress = async (publicAddress: string) => {
    const account = await AccountRepository.findByPublicAddress(publicAddress);
    if (!account) {
        throw new UnauthorizedError('');
    }
    return account;
};

export default {
    findByPublicAddress: findByPublicAddress
};