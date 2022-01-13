import { NotFoundError, UnauthorizedError } from '../errors/http';
import AccountRepository from '../repos/account';
import { isSignatureValid } from '../utils/eth';
import * as jwt from '../utils/jwt';


const NONCE_MAX_LENGTH = 16;

const getNonce = async (publicAddress: string) => {
    const nonce = jwt.randomizeText(NONCE_MAX_LENGTH);
    const account = await AccountRepository.findById(publicAddress);
    if (account) {
        await AccountRepository.updateNonceById(
            publicAddress,
            nonce
        );
    }
    else {
        throw new NotFoundError('');
    }
    return nonce;
};

const validateSignature = async (publicAddress: string, signature: string) => {
    const nonce = (await AccountRepository.findById(publicAddress))?.nonce || '';
    if (!isSignatureValid(nonce, publicAddress, signature)) {
        throw new UnauthorizedError('');
    }
    return jwt.generateToken({
        id: publicAddress,
        nonce: nonce
    });
};


export default {
    getNonce: getNonce,
    validateSignature: validateSignature
};