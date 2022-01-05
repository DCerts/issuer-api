import { UnauthorizedError } from '../errors/http';
import AccountRepository from '../repos/account';
import IssuerRepository from '../repos/issuer';
import { isSignatureValid } from '../utils/eth';
import * as jwt from '../utils/jwt';


const NONCE_MAX_LENGTH = 16;

const getNonce = async (publicAddress: string) => {
    const nonce = jwt.randomizeText(NONCE_MAX_LENGTH);
    const account = await AccountRepository.findByPublicAddress(publicAddress);
    if (account) {
        await AccountRepository.save({
            publicAddress: publicAddress,
            nonce: nonce
        });
    }
    else {
        await AccountRepository.create({
            publicAddress: publicAddress,
            nonce: nonce
        });
        await IssuerRepository.create({
            id: publicAddress,
            name: null,
            email: null
        });
    }
    return nonce;
};

const validateSignature = async (publicAddress: string, signature: string) => {
    const nonce = (await AccountRepository.findByPublicAddress(publicAddress))?.nonce;
    if (!isSignatureValid(nonce, publicAddress, signature)) {
        throw new UnauthorizedError('');
    }
    return jwt.generateToken({
        publicAddress: publicAddress,
        nonce: nonce
    })
};


export default {
    getNonce: getNonce,
    validateSignature: validateSignature
};