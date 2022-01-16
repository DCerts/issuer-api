import { EMPTY } from '../commons/str';
import { ErrorCode } from '../errors/code';
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
        throw new NotFoundError(EMPTY, ErrorCode.ACCOUNT_NOT_FOUND);
    }
    return nonce;
};

const validateSignature = async (publicAddress: string, signature: string) => {
    const nonce = (await AccountRepository.findById(publicAddress))?.nonce || EMPTY;
    if (!isSignatureValid(nonce, publicAddress, signature)) {
        throw new UnauthorizedError(EMPTY, ErrorCode.UNAUTHORIZED);
    }
    return jwt.generateToken({
        id: publicAddress,
        nonce: nonce
    });
};

const logout = async (publicAddress: string) => {
    try {
        await getNonce(publicAddress);
    } catch (err) {
        console.log(err);
    }
};

export default {
    getNonce: getNonce,
    validateSignature: validateSignature,
    logout: logout
};