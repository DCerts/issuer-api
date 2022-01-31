import AccountRepository from '../repos/account';
import { JwtUtils } from '../utils/jwt';
import AuthService from './auth';


const generateToken = async (publicAddress: string) => {
    let nonce = (await AccountRepository.findById(publicAddress))?.nonce;
    if (!nonce) {
        nonce = await AuthService.getNonce(publicAddress);
    }
    return JwtUtils.generateToken({
        id: publicAddress,
        nonce: nonce
    });
};

export default {
    generateToken
};